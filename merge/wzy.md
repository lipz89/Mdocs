<h1 style="text-align:center">物资云接口定义</h1>

|作者|lpz|
|:--|--:|
|版本|1.0.0|
|版权|©2019, 快享医疗.|
<div STYLE="page-break-after: always;"></div>
<h4><a href="#BfwIxXGu" title="交换标准说明">1 交换标准说明</a></h2>
<h4><a href="#rZyvaKxm" title="耗材">2 耗材</a></h2>
<h4><a href="#gfMOBmwK" title="MY003 医院耗材规格">2.1 MY003 医院耗材规格</a></h2>
<h4><a href="#JgOYXCcp" title="MY004 企业信息">2.2 MY004 企业信息</a></h2>
<h4><a href="#dLqWsFRi" title="MY014 供货关系">2.3 MY014 供货关系</a></h2>
<h4><a href="#FmksQlAj" title="MY016 企业证件">2.4 MY016 企业证件</a></h2>
<h4><a href="#cEBeNXdF" title="MY019 物资分类">2.5 MY019 物资分类</a></h2>
<h4><a href="#nBMmGCRe" title="MY101 订单信息">2.6 MY101 订单信息</a></h2>
<h4><a href="#IAbgJPta" title="MY102 配送单信息">2.7 MY102 配送单信息</a></h2>
<h4><a href="#yMpbBezC" title="MY104 退货单信息">2.8 MY104 退货单信息</a></h2>
<h4><a href="#hlVZmSBM" title="MY106 配送单验收">2.9 MY106 配送单验收</a></h2>
<h4><a href="#NPUXtheG" title="MY109 发票验收">2.10 MY109 发票验收</a></h2>
<h4><a href="#NJTBYtFv" title="MY110 平台基础规格">2.11 MY110 平台基础规格</a></h2>
<h4><a href="#hNrIumMF" title="MY114 跟台订单">2.12 MY114 跟台订单</a></h2>
<h4><a href="#mLAejdXa" title="MY118 发票凭证">2.13 MY118 发票凭证</a></h2>
<h4><a href="#cwOMLUqt" title="药品">3 药品</a></h2>
<h4><a href="#FsXpTtjo" title="YY001 医院信息">3.1 YY001 医院信息</a></h2>
<h4><a href="#KnRGbqvd" title="YY002 配送点消息">3.2 YY002 配送点消息</a></h2>
<h4><a href="#pfTeKGXF" title="附录">4 附录</a></h2>
<h4><a href="#SQKCduvJ" title="数据字典">4.1 数据字典</a></h2>
<h4><a href="#sFgzUQOk" title="数据格式">4.2 数据格式</a></h2>
<div STYLE="page-break-after: always;"></div>
<h2 id="BfwIxXGu">1 交换标准说明</h2>

## 接口地址
物资云只有一个接口地址，就是
`/DataApi3/Consumer`

## 请求头
```properties
content-type=application/json

#药品物资云用以配置返回的Json禁用驼峰命名法，默认启用驼峰命名法
response-content-type=json2
#耗材物资云用以配置返回的Json启用驼峰命名法，默认禁用驼峰命名法
response-content-type=camel
```

## 参数

```json
{
  "BusinessType": "MY003",
  "HospitalCode": "hospitalCode",
  "EventType": "post",
  "Data": [
    {
      "ID":"1",
      "OrderNo":"12121"
    }
  ]
}
```
其中
> `BusinessType` 是指具体业务代码
> `HospitalCode` 是指具体业务涉及的医院代码
> `EventType` 是指事件类型

## 支持事件

|事件类型|说明|方式|数据格式说明|
|--|--|--|--|
|post|消息发送|异步|必须包含所有数据字段，接收方根据数据标识判断是否存在，不存在则执行添加操作，否则执行更新操作|
|update|状态更新|实时|只需要包含标识字段和需要更新的字段，根据标识查找，找到后更新提供的字段，主要用于更新各种数据状态|
|updateDownloadState|更新下载状态|实时|只需要包含标识字段，和结果标识，如果失败需要包含失败信息|
|cancel|异常回退，取消，作废等操作|实时|只需要包含标识字段，不需要额外字段，接收方直接对该标识对应的数据执行撤销作废操作|

## 返回结果
### 异步方法的返回结果
异步方法（post）返回消息确认结果，只有成功或失败:
```json
{
  "Code": 0,
  "Message": "消息确认成功",
  "Completed":false
}
```
接收方消息处理成功后会向事件源发送一个`updateDownloadState`事件
因为发起`updateDownloadState`事件需要通过DEP返回，所以需要将参数封装在返回数据结构的Data中，如下：
```json
{
  "BusinessType": "MY003",
  "HospitalCode": "hospitalCode",
  "EventType": "updateDownloadState",//这个不需要写，dep转发的时候会自己加
  "Data": [
    {
      "Code": 0,
      "ID":"1",
      "OrderNo":"12121",
      "Message": "消息处理成功",
      "ValueMaps":[
        {
          "OldValue":"1",
          "NewValue":"2"
        }
      ]
    }
  ]
}
```
### 实时方法的返回结果
实时方法（update,cancel,updateDownloadState）返回下消息处理结果:
```json
{
  "Code": 0,
  "Message": "消息处理成功",
  "Completed":false
}
```
失败区分失败原因，并提供失败代码和消息:
```json
{
  "Code": 11002,
  "Message": "订单已开始配货，无法撤销。",
  "Completed":false
}
```

## 交换标准说明
![交换标准说明](/images/wzy/instruction.jpg)
<h2 id="rZyvaKxm">2 耗材</h2>

<h2 id="gfMOBmwK">2.1 MY003 医院耗材规格</h2>


>根据代码`Code`判断存在性，不存在则添加。

## post-上传数据
>说明

### 示例请求

```json
{
  "BusinessType": "MY003",
  "HospitalCode": "{{hospitalCode}}",
  "EventType": "post",
  "Data": [
    {
      "MaterialCode": "",
      "MaterialNo": "",
      "MaterialSpecNo": "",
      "MaterialID": "",
      "MaterialName": "",
      "MaterialCommonName": "",
      "MaterialHospitalName": "",
      "StandardClassifyIds": "",
      "StandardClassifyName": "",
      "RegCertId": "",
      "RegCertNo": "",
      "MaterialSpecID": "",
      "MaterialSpecCode": "",
      "MaterialSpecName": "",
      "FactoryCode": "",
      "FactoryID": "",
      "SocialCreditID": "",
      "FactoryName": "",
      "Unit": "",
      "UnitName": "",
      "PYJC": "",
      "WBJC": "",
      "ManagementCategory": "",
      "SourceType": "",
      "SourceTypeName": "",
      "Brand": "",
      "PackUnit": "",
      "PackUnitName": "",
      "PackQuantity": "",
      "Price": "",
      "MaterialGenre": "",
      "PackNote": "",
      "OriginPlaceName": "",
      "MaterialType": "",
      "FixedNumber": "",
      "BarcodeType": "",
      "ExchangeCodeID": "",
      "RuleTitle": "",
      "CustomClassifyIds": "",
      "CustomClassifyName": "",
      "DepartmentID": "",
      "DepartmentName": "",
      "DepartmentCode": "{hospitalCode}",
      "Status": "",
      "UpdateTime": "",
      "UpdaterID": "",
      "UpdaterName": "",
      "CreateUserName": "",
      "CreateUserID": "",
      "UpdateToDepStatus": "",
      "GTIN": "",
      "PurchaseCategory": "",
      "ColdChainManagement": "",
      "ColdChainMinTemperature": "",
      "ColdChainMaxTemperature": "",
      "DepartmentMaterialCatalog": "",
      "MaterialSpecPY": "",
      "FactoryPY": "",
      "RowTimestamp": "",
      "CreateTime": ""
    }
  ]
}
``` 
### 请求结果
```json
{
  "OrderNo": null,
  "ID": null,
  "Result": true,
  "Code": 0,
  "Message": "成功"
}
```


<h2 id="JgOYXCcp">2.2 MY004 企业信息</h2>

## post-上传数据
>说明

### 示例请求

```json
{//标注为【必传】的字段不能少，否则插入数据库的时候可能回报错，其余的字段可不填
    "BusinessType": "MY004",        //必传
    "HospitalCode": "Test001",      //必传
    "EventType": "post",            //必传
    "Data": [
        {
            "Code": "BH2221110",   //编码 必传
            "Name": "测试", //名称 必传
            "Type":1,//企业类型（1：生产厂家、2：供应商） 必传
            "OrgTypeCode": "",               //企业类型代码参照dep 必传
            "BusinessLic": "987654321012345678",//营业执照 必传
            "Persider": "制单人",               //法人
            "PersiderTel":"", //法人电话
            "PersiderEmail":"",//法人邮箱
            "RegAddrString": "安徽省 合肥市 肥西县",//所属地区   省+空格+市+空格+县
            "RegisteredAddress": "ssasdsadasdas",          //注册地址
            "Contacter": "ppppp",                 //联系人姓名
            "ContactNumber": "13911111111",             //联系人电话
            "ContactEmail": "213123@qq.com"             //联系人邮箱
        }
    ]
}
``` 
### 请求结果
```json
{
  "Code": 0,
  "Message": "成功",
  "Completed": true,
  "Data": [
    {
      "Code": 0,
      "Message": "新增成功",
      "OrderNo": "测试"
    }
  ]
}
```

<h2 id="dLqWsFRi">2.3 MY014 供货关系</h2>

### 暂未维护
<h2 id="FmksQlAj">2.4 MY016 企业证件</h2>


> 包含企业证件，注册证等
## post-上传数据
>说明

### 示例请求

```json
{
  "BusinessType": "MY016",
  "HospitalCode": "201903070000008",
  "EventType": "post",
  "Data": [
    {
    	"CompCode":"BH2221110",
    	"CompType":1,
    	"CredentialsNo":"cesi123",
    	"Type":"01", //参照物质云平台类型
    	"FromTime":"2017-01-03",
    	"ExpiredTime":"2999-12-31",//2999-12-31长期
    	"State":1
    }
  ]
}
``` 
### 请求结果
```json
{
  "Code": 0,
  "Message": "成功",
  "Completed": true,
}
```

<h2 id="cEBeNXdF">2.5 MY019 物资分类</h2>



## post-上传数据
>说明

### 示例请求

```json
{
  "BusinessType": "MY019",
  "HospitalCode": "320113426010230",
  "EventType": "post",
  "Data": [
    {
      "Name": "一级分类",
      "NO": "NO02",
      "ParentNO": ""
    },
    {
      "Name": "二级分类",
      "NO": "NO0101",
      "ParentNO": "NO01"
    }
  ]
}
``` 
### 请求结果
```json
{
  "Code": 0,
  "Message": "成功",
  "Completed": true,
  "Data": [
    {
      "OrderNo": "NO02",
      "Code": 0,
      "Message": "保存成功"
    },
    {
      "OrderNo": "NO0101",
      "Code": 0,
      "Message": "保存成功"
    }
  ]
}
```

<h2 id="nBMmGCRe">2.6 MY101 订单信息</h2>



## post下载订单
>订单下载，如果订单号存在，则为更新

### 示例请求
```JSON
{
  "BusinessType": "MY101",
  "HospitalCode": "test02",
  "EventType": "post",
  "Data": [
    {
      "ID": "20170828150936000001",
      "ID3": null,
      "ProductType": "0",
      "HospitalCode": "test02",
      "OrderNO": "Test20170809B00401",
      "SupplierCode": "苏0001",
      "Supplier": "测试供应商",
      "DistributionSiteCode": "03",
      "DistributionSite": "药库03",
      "ArrivalTime": "2016-12-28 14:55:01",
      "Creator": "制单人",
      "CreateTime": "2016-12-28 14:55:01",
      "Auditor": null,
      "AuditTime": null,
      "State": "0",
      "Memo": "金石订单1",
      "PPOrderNO": null,
      "OrderType": "0",
      "OrderLevel": "0",
      "Employee": "**",
      "SumQuantity": 4,
      "Amount": 13.8,
      "Abandoner": null,
      "AbandonTime": null,
      "AbandonType": null,
      "AbandonReason": null,
      "AcceptTime": null,
      "Source": null,
      "PurchaseDetail": [
        {
          "ID": "201708281509360000010001",
          "ID3": null,
          "UniCode": "A.185770.1",
          "UniCode3": "X00069400310010",
          "Name": "克拉霉素分散片",
          "Spec": "0.125g",
          "Manufacturer": "成都恒瑞制药有限公司",
          "Unit": "盒",
          "Price": 1.2,
          "Quantity": 1,
          "Amount": 1.2,
          "State": "0",
          "Memo": "明细备注",
          "Seq": 1141451443,
          "PurchasePlanDetailID": null,
          "DeptCode": "科室编码1",
          "DeptName": "科室名称1",
          "StoreCode": "库房编码1",
          "StoreName": "库房名称1",
          "AbandonType": null,
          "AbandonReason": null
        }
      ]
    }
  ]
}
```
### 请求结果

```json
{
  "Code": 0,
  "Message": "成功",
  "Completed": true,
  "Data": [
    {
      "ID": "20170828150936000001",
      "OrderNo": "1223"
    }
  ]
}
```
## update-更新订单状态
> 审核，弃审，等操作
### 示例请求

```json
{
    "BusinessType": "MY101",
    "HospitalCode": "320113426010230",
  	"EventType":"update",
    "Data": [
        {
            "ID3": "20181023152047000001",
            "State": "6"
    	},
        {
            "ID3": "20181102142707000001",
            "State": "7"
        }
    ]
}
```

### 请求结果
```json
{
  "Code": 0,
  "Message": "成功",
  "Completed": true,
  "Data": [
    {
      "Code": 0,
      "Message": "成功"
    },
    {
      "Code": 0,
      "Message": "成功"
    }
  ]
}
```
			
<h2 id="IAbgJPta">2.7 MY102 配送单信息</h2>



## post-上传数据
>说明

### 示例请求

```json
{
  "BusinessType": "MY102",
  "HospitalCode": "test02",
  "EventType": "post",
  "Data": [
    {
      "HospitalCode": "test02",
      "OrderNO": "PS20190322",
      "SupplierCode": "苏0001"
    }
  ]
}
``` 
### 请求结果
```json
{
  "Code": 0,
  "Message": "成功",
  "Completed": true,
  "Data": [
    {
      "Code": 0,
      "OrderNO": "PS20190322"
    }
  ]
}
```

<h2 id="yMpbBezC">2.8 MY104 退货单信息</h2>



## post-上传数据
>说明

### 示例请求

```json
{
  "BusinessType": "MY104",
  "HospitalCode": "test02",
  "EventType": "post",
  "Data": [
    {
      "HospitalCode": "test02",
      "OrderNO": "thd0010",
      "SupplierCode": "苏0001",
      "DistributionSiteCode": "03",
      "Creator": "制单人",
      "CreateTime": "2016-12-28 14:55:01",
      "Memo": "备注",
      "RefundDetail": [
        {
          "ID3": "123",
          "UniCode": "A.101116.1",
          "Quantity": 1,
          "Price": 1.2,
          "Amount": 1.2,
          "BatchNO": "生产批号",
          "ProductionDate": "2016-01-01",
          "InvalidDate": "2017-01-01",
          "Memo": "明细备注",
          "DistributionDetailID3": "9fe7fcfe-9fcb-4ecc-8806-e0644f3e2a9e"
        }
      ]
    }
  ]
}
``` 
### 请求结果
```json
{
  "Code": 0,
  "Message": "成功",
  "Completed": true,
  "Data": [
    {
      "Code": 0,
      "OrderNo": "thd0010"
    }
  ]
}
```

<h2 id="hlVZmSBM">2.9 MY106 配送单验收</h2>

<h2 id="NPUXtheG">2.10 MY109 发票验收</h2>



## post-上传数据
>说明

### 示例请求

```json
{
  "BusinessType": "MY109",
  "HospitalCode": "test02",
  "EventType": "post",
  "Data": [
    {
      "ID": "FP20190123001",
      "DetectionAmount": "2",
      "DetectionState": "1",
      "DetectionMemo": "通过",
      "Acceptor": "验收人"
    }
  ]
}
``` 
### 请求结果
```json
{
  "Code": 0,
  "Message": "成功",
  "Completed": true,
  "Data": [
    {
      "OrderNo": "FP20190123001",
      "Code": 0
    }
  ]
}
```

<h2 id="NJTBYtFv">2.11 MY110 平台基础规格</h2>



## post-上传数据
>说明

### 示例请求

```json
{
  "BusinessType": "MY110",
  "HospitalCode": "test02",
  "EventType": "post",
  "Data": [
    {
      "UniCode": "A.176183.10",
      "Brand": "品牌ABC",
      "StdClassificationNO": "NO0201",
      "ApprovalNumber": "测试bbb2",
      "Name": "耗材01",
      "Spec": "耗材规格",
      "TradeName": "",
      "ManufacturerCode": "黔20160024",
      "Manufacturer": "贵州天安药业股份有限公司",
      "ApprovalTime": "2014-09-01",
      "Unit": "瓶",
      "UnitRatio": 10,
      "PackUnit": "盒",
      "PackNote": "850mg×60片/瓶,塑料瓶",
      "PackQuantity": 60,
      "ReferencePrice": 0,
      "RetailPrice": 0,
      "SimpleCharacter": "hc",
      "Range": "范围",
      "Memo": null,
      "Type": "0",
      "ID3": "tttttt002",
      "Category": "1",
      "MaterialsProps": 1,
      "PurchaseCategory": 1,
      "Enable": true,
      "ColdChainTempFrom": 12.3,
      "ColdChainTempTo": 45.6
    }
  ]
}
``` 
### 请求结果
```json
{
  "Code": 0,
  "Message": "成功",
  "Completed": true
}
```

<h2 id="hNrIumMF">2.12 MY114 跟台订单</h2>



## post-上传数据
>说明

### 示例请求

```json
{
  "BusinessType": "MY114",
  "HospitalCode": "201902200000000001",
  "EventType": "post",
  "Data": [
    {
      "patientName": "小李",
      "patientSex": "男",
      "ID": null,
      "ID3": "20180302140014000001",
      "ProductType": "1",
      "HospitalCode": "201902200000000001",
      "OrderNO": "Test002",
      "SupplierCode": "GB000001",
      "Supplier": "物资云耗材合并版供应商",
      "DistributionSiteCode": null,
      "DistributionSite": null,
      "Creator": "制单人",
      "CreateTime": "2016-12-28 14:55:01",
      "Auditor": null,
      "AuditTime": null,
      "State": "2",
      "Memo": "备注",
      "Managed": true,
      "DeptCode": "C001",
      "DeptName": "C001科室",
      "StoreCode": "T001",
      "StoreName": "T001库房",
      "SurgeryName": "手术名称",
      "HospitalizationNo": "382183712831",
      "CertificateNo": "341267198007155362",
      "PatientName": "小李",
      "PatientSex": "男",
      "SurgeonName": "医生姓名",
      "SurgeryTime": "2018-05-28 14:55:01",
      "ArrivalTime": "2018-05-25 14:55:01",
      "DeliveryAddress": "合肥市a区a医院",
      "SurgeryMemo": "手术备注",
      "SurgeryDetails": [
        {
          "surgeryID": "20180302140014000001",
          "ID": "201803021400140000010001",
          "ID3": null,
          "UniCode": "ggbh001",
          "UniCode3": null,
          "Name": "手术刀",
          "Spec": "10mm",
          "Manufacturer": "测试生产厂家2017110",
          "Unit": "枚",
          "Price": 1.2,
          "Quantity": 1,
          "Amount": 1.2,
          "State": "0",
          "Memo": "明细备注",
          "HisCode": null,
          "Seq": 1,
          "AbandonType": null,
          "AbandonReason": null
        },
        {
          "surgeryID": "20180302140014000001",
          "ID": "201803021400140000010002",
          "ID3": null,
          "UniCode": "A.213332.8",
          "UniCode3": null,
          "Name": "住院部桌子",
          "Spec": "上传01",
          "Manufacturer": "合肥生产厂商",
          "Unit": "根",
          "Price": 4.2,
          "Quantity": 3,
          "Amount": 12.6,
          "State": "0",
          "Memo": "明细备注2",
          "HisCode": null,
          "Seq": 2,
          "AbandonType": null,
          "AbandonReason": null
        }
      ]
    }
  ]
}
``` 
### 请求结果
```json
{
    "Code": 0,
    "Message": "成功",
    "Completed": true,
    "Data": [
        {
            "OrderNo": "Test002",//订单编号
            "ID": "20180302140014000001",//--ID3，院内订单ID
            "Code": 0,
            "Message": "跟台订单【Test002】成功。"
        }
    ]
}
```

<h2 id="mLAejdXa">2.13 MY118 发票凭证</h2>



## post-上传数据
>说明

### 示例请求

```json
{//标注为【必传】的字段不能少，否则插入数据库的时候可能回报错，其余的字段可不填
    "BusinessType": "MY118",        //必传
    "HospitalCode": "Test001",      //必传
    "EventType": "post",            //必传
    "Data": [
        {
            "ID3": "20170828150936000001",
            "HospitalCode": "320113426010230",  //必传
            "SupplierCode": "1",                //必传
            "DateTime": "2019-01-17 14:55:01",
            "Creator": "制单人",                //必传
            "CreateTime": "2019-01-17 14:55:01",//必传
            "IsCreateInvoice": 0,
            "OrderNo": "NO00167",               //必传
            "VoucherType": 1,                   //凭证类型
            "Status": 1,
            "Memo": "备注",
            "InvoiceCredentialDetail": [        //必传
                {
                    "ScanTime": "2018-12-28 14:55:01",
                    "CreateTime": "2018-11-20 14:55:01",
                    "ID3": "20170828150936000002",
                    "UniCode": "A.1011336.1",               //必传
                    "BatchNO": "生产批号",                  //必传
                    "SterilzeDate": "2018-12-28 14:55:01",  //必传
                    "InvalidDate": "2028-12-28 14:55:01",   //必传
                    "MasterBarCode": "bh23456",             //商品主条码
                    "SlaveBarCode": "code2334245",          //商品从条码
                    "Price": 12,                            //必传
                    "Quantity": 3,                          //必传
                    "Unit": "箱",                           //必传
                    "Amount": 36,                           //必传
                    "RetailPrice": 15,//零售价              //必传
                    "Operator": "操作员candy",
                    "HospitalizationNo": "住院号001",       //必传
                    "PatientName": "患者姓名张三",          //必传
                    "Source": "1",                          //必须是最大长度为“1”的字符串或数组类型
                    "ChargeEncode": "hhhh",
                    "ExecutDept": "执行科室1",
                    "Store": "库房名称1",
                    "DistributionDetailID3": "1111111111"
                },
                {
                    "ScanTime": "2018-12-28 14:55:01",
                    "CreateTime": "2018-11-28 14:55:01",
                    "ID3": "20170828150936000003",
                    "UniCode": "A.1011336.1",
                    "BatchNO": "生产批号",
                    "SterilzeDate": "2018-12-28 14:55:01",
                    "InvalidDate": "2028-12-28 14:55:01",
                    "MasterBarCode": "bh23456",
                    "SlaveBarCode": "code2334245",
                    "Price": 15,
                    "Quantity": 4,
                    "Unit": "箱",
                    "Amount": 60,
                    "RetailPrice": 20,
                    "Operator": "操作员candy",
                    "HospitalizationNo": "住院号002",
                    "PatientName": "患者姓名李四",
                    "Source": "1",
                    "ChargeEncode": "hhhh2",
                    "ExecutDept": "执行科室2",
                    "Store": "库房名称2",
                    "DistributionDetailID3": "222222"
                }
            ]
        }
    ]
}
``` 
### 请求结果
```json
{
  "Code": 0,
  "Message": "成功",
  "Completed": true,
  "Data": [
    {
      "Code": 0,
      "Message": "发票凭证下载到监管平台成功"
    }
  ]
}
```

<h2 id="cwOMLUqt">3 药品</h2>

<h2 id="FsXpTtjo">3.1 YY001 医院信息</h2>

<h2 id="KnRGbqvd">3.2 YY002 配送点消息</h2>

<h2 id="pfTeKGXF">4 附录</h2>

<h2 id="SQKCduvJ">4.1 数据字典</h2>


> **数据字典** 主要是对一般常用的枚举类型的定义。

## 1 订单类型
|数值|说明|
|:--|:--|
|0|日常采购|
|1|特需采购|

## 2 订单级别
|数值|说明|
|:--|:--|
|0|普通|
|1|紧急|

## 3 查询类别
|数值|说明|
|:--|:--|
|0|普通|
|1|下载|

## 4 下载状态
|数值|说明|
|:--|:--|
|0|未下载|
|1|已下载|
|2|全部|

## 5 单位类型
|数值|说明|
|:--|:--|
|1|生产厂家|
|2|供应商|

## 6 生产厂家类型
|数值|说明|
|:--|:--|
|1|生产厂家(境内)|
|2|生产厂家(境外)|
|5|国外厂家(国内分公司)|

## 7 供应商类型
|数值|说明|
|:--|:--|
|3|代理商(国内)|
|4|代理商(港澳台)|

## 8 产品类型
|数值|说明|
|:--|:--|
|0|药品|
|1|耗材|

## 9 消耗类型
|数值|说明|
|:--|:--|
|1|正常消耗|
|2|撤销|

## 10 消耗来源
|数值|说明|
|:--|:--|
|1|门诊|
|2|住院|

## 11 报损报溢类型
|数值|说明|
|:--|:--|
|1|报损|
|2|报溢|

## 12 销售类型
|数值|说明|
|:--|:--|
|0|普通|
|1|赠送|
|2|寄售|

## 13 中药类型
|数值|说明|
|:--|:--|
|1|饮片|
|2|方剂|

## 14 数据状态
|数值|	说明|
|:--|:--|
|0|	有效|
|2|	供应商接收订单|
|3|	已验收|
|4|	验收已确认|
|9|	作废|

## 15 配送检品状态
|数值|	说明|
|:--|:--|
|0|	验收不通过|
|1|	验收通过|

## 16 性别
|数值|	说明|
|:--|:--|
|1|	男|
|2|	女|
|9|	其他|

## 17 代煎代配类型
|数值|	说明|
|:--|:--|
|0|	院内处理|
|1|	代煎快递|
|2|	代配快递|
|3|	代煎自提|
|4|	代配自提|

## 18 数据操作类型
|数值|	说明|
|:--|:--|
|0|	新增|
|9|	删除|

## 19 配送检品数据状态
|数值|	说明|
|:--|:--|
|0|	待验收/检品|
|1|	已验收/检品|
|2|	验收结果已确认|

## 20 处方状态
|数值|	说明|
|:--|:--|
|00|	作废|
|10|	抓药开始|
|11|	抓药完成|
|20|	煎药开始|
|21|	煎药完成|
|30|	配送开始|
|31|	收药|

## 21 配送单据类型
|数值|	说明|
|:--|:--|
|1|	普通单据|
|2|	代销|
|3|	临时|

## 22 发票类型
|数值|	说明|
|:--|:--|
|1|	根据订单生成|
|2|	根据配送生成|
|3|	根据退货生成|
|4|	根据消耗生成|
|5|	根据红冲生成|

## 23 跟台订单状态
|数值|	说明|
|:--|:--|
|0|待提交|
|1|待审核|
|2|审核不通过|
|3|审核通过|
|5|待配货|
|7|已配货|
|9|已验收|
|10|审核前撤销|
|11|采购拒收|
|12|已拒收(供应商)|
>说明：假如状态前面带”-“,表示”部分”。如”-5”表示”部分待配货”。

## 24 普通订单状态
|数值|说明|
|:--|:--|
|1|待配货|
|2|已拒绝|
|3|配货中|
|4|已配货|
|5|已验收|
|6|预弃审|
|7|已弃审|
<h2 id="sFgzUQOk">4.2 数据格式</h2>


>  **数据格式** 主要是对一般常用的数据类型的格式定义。

## 1 时间日期格式
|数值|示例|
|:--|:--|
|yyyy-MM-dd|2016-01-01|
|yyyy-MM-dd HH:mm:ss|2016-01-01 13:13:13|
