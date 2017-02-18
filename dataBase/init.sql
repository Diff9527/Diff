--整个数据库的最大容量（大概是2.14GB 或 1,070,000,000 双字节字符） 一个mdb文件的最大文件大小

/* 
	创建表 system_log 系统日志表
	log_id 日志ID 主键 17位字符、时间戳
	operation_ip 操作ip
	content 内容体  非空
	log_time 日志时间  默认插入时的日期时间
*/
DROP TABLE [system_log];
CREATE TABLE [system_log] (
	[log_id] VARCHAR(17) PRIMARY KEY,
	[operation_ip] TEXT(50),
	[content] MEMO NOT NULL,
	[log_time] DateTime Default now
);


/* 
	创建表 product 产品表
		说明：产品对象。
	product_code 产品编码 主键 (注：板号)
	product_name 产品名称 非空
	product_caption 产品说明
*/
DROP TABLE [product];
CREATE TABLE [product] (
	[product_code] VARCHAR(20) PRIMARY KEY,
	[product_name] TEXT(50) NOT NULL,
	[product_caption] TEXT(200)
);


/* 
	创建表 order 订单表
		说明：订单对象。
	order_code 订单编码 主键
	order_description 订单描述 非空
	order_time 订单时间 非空
	order_source 订单源
*/
DROP TABLE [order];
CREATE TABLE [order] (
	[order_code] VARCHAR(20) PRIMARY KEY,
	[order_description] TEXT(200) NOT NULL,
	[order_time] DateTime NOT NULL,
	[order_source] TEXT(50)
);


/* 
	创建表 order_item 订单明细表
		说明：订单中的产品及数量。
	order_item_id 订单明细id 主键 17位字符、时间戳
	order_code 订单编码  关联订单表 非空
	product_code 产品编码 非空
	product_demand_number 订购该产品数量 非空
	order_item_note 订单项说明
*/
DROP TABLE [order_item];
CREATE TABLE [order_item] (
	[order_item_id] VARCHAR(17) PRIMARY KEY,
	[order_code] VARCHAR(20) NOT NULL,
	[product_code] VARCHAR(20) NOT NULL,
	[product_demand_number] DOUBLE NOT NULL,
	[order_item_note] TEXT(50)
);


/* 
	创建表 step 工序表
		说明：工序对象、生产工序、生产步骤。
	step_code 工序编码 主键 (注：工序号)
	step_name 工序名称 非空
	product_code 产品编码 非空
	step_caption 工序说明
	step_quota 工序配额  说明：标准工时定额，该工序按标准工时(如1小时)应当完成的数量
*/
DROP TABLE [step];
CREATE TABLE [step] (
	[step_code] VARCHAR(20) PRIMARY KEY,
	[step_name] TEXT(50) NOT NULL,
	[product_code] VARCHAR(20) NOT NULL,
	[step_caption] TEXT(200),
	[step_quota] DOUBLE
);


/* 
	创建表 worker 劳动者表
		说明：工人、劳动者对象。
	worker_code 工号编码 主键
	worker_name 劳动者名称 非空
	worker_post 劳动者岗位
	attendance_date_start 考勤统计起始日期 非空
	base_rest_number 调休基数
*/
DROP TABLE [worker];
CREATE TABLE [worker] (
	[worker_code] VARCHAR(10) PRIMARY KEY,
	[worker_name] TEXT(10) NOT NULL,
	[worker_post] TEXT(20),
	[attendance_date_start] DateTime NOT NULL,
	[base_rest_number] DOUBLE
);


/* 
	创建表 material_record 领料记录表
		说明：领取原料流水记录，原料数据。
	material_record_id 领料记录id 主键 17位字符、时间戳
	material_record_date 领料记录日期 非空
	order_code 订单编码 非空
	product_code 产品编码 非空
	pick_number 领取数量
	--pick_count 领取数量累计  取消 [pick_count] DOUBLE, 领取数量累计 在查询中即时计算
	worker_code 经手人、责任人编码
	remark 备注
*/
DROP TABLE [material_record];
CREATE TABLE [material_record] (
	[material_record_id] VARCHAR(17) PRIMARY KEY,
	[material_record_date] DateTime NOT NULL,
	[order_code] VARCHAR(20) NOT NULL,
	[product_code] VARCHAR(20) NOT NULL,
	[pick_number] DOUBLE,
	[worker_code] VARCHAR(10),
	[remark] TEXT(200)
);


/* 
	创建表 production_record 生产记录表
		说明：生产流水记录，生产数据。
	production_record_id 生产记录id 主键 17位字符、时间戳
	production_record_date 生产记录日期 非空
	order_code 订单编码 非空
	product_code 产品编码 非空
	finish_number 完成数量  说明：'本日入库'好无语。 记录本条日期(单一天)完成数量
	--finish_count 完成累计、累计完成数量    取消 [finish_count] DOUBLE, 完成累计 在查询中即时计算
	--stay_number 待生产数量    取消 [stay_number] DOUBLE, 待生产数量 在查询中即时计算
	pass_rate 通过率、合格率  说明： 录入值  不参与逻辑
	worker_code 经手人、责任人编码
	remark 备注
*/
DROP TABLE [production_record];
CREATE TABLE [production_record] (
	[production_record_id] VARCHAR(17) PRIMARY KEY,
	[production_record_date] DateTime NOT NULL,
	[order_code] VARCHAR(20) NOT NULL,
	[product_code] VARCHAR(20) NOT NULL,
	[finish_number] DOUBLE,
	[pass_rate] DOUBLE,
	[worker_code] VARCHAR(10),
	[remark] TEXT(200)
);


/* 
	创建表 attendance_record 考勤记录表
		说明：加班调休记录、局域级考勤记录。
	attendance_record_id 考勤记录id 主键 17位字符、时间戳
	attendance_record_date 考勤记录日期 非空
	attendance_record_type 考勤记录类型 非空  说明：考勤记录类型  'overtime'加班、'rest'调休、'holiday'请假、'other'其他
	worker_code 被考勤劳动者编码 非空
	length_number 时长、时间长度 非空 说明：考勤的时间长度
	attendance_content 考勤记录内容体 
	--add_count 累计加班时长  取消 [add_count] DOUBLE, 累计加班时长 在查询中即时计算
	--less_count 累计调休时长  取消 [less_count] DOUBLE, 累计调休时长 在查询中即时计算
	--last_count 待调休时长  取消 [last_count] DOUBLE, 待调休时长 在查询中即时计算
	remark 备注
*/
DROP TABLE [attendance_record];
CREATE TABLE [attendance_record] (
	[attendance_record_id] VARCHAR(17) PRIMARY KEY,
	[attendance_record_date] DateTime NOT NULL,
	[attendance_record_type] VARCHAR(20) NOT NULL,
	[worker_code] VARCHAR(10) NOT NULL,
	[length_number] DOUBLE NOT NULL,
	[attendance_content] TEXT(200),
	[remark] TEXT(200)
);


/* 
	创建表 work_record 工作记录表
		说明：生产工作流水记录，工作数据。
	work_record_id 工作记录id 主键 17位字符、时间戳
	work_record_date 工作记录日期 非空
	order_code 订单编码 非空
	product_code 产品编码 非空
	step_code 工序编码 非空 (注：工序号)
	piece_number 完成件数量  说明：计件
	hours_number 实际使用工时  说明：计时，单位小时
	pass_rate 通过率、合格率  说明： 录入值  不参与逻辑
	worker_code 加工人 非空
	remark 备注
*/
DROP TABLE [work_record];
CREATE TABLE [work_record] (
	[work_record_id] VARCHAR(17) PRIMARY KEY,
	[work_record_date] DateTime NOT NULL,
	[order_code] VARCHAR(20) NOT NULL,
	[product_code] VARCHAR(20) NOT NULL,
	[step_code] VARCHAR(20) NOT NULL,
	[piece_number] DOUBLE,
	[hours_number] DOUBLE,
	[pass_rate] DOUBLE,
	[worker_code] VARCHAR(10) NOT NULL,
	[remark] TEXT(200)
);
