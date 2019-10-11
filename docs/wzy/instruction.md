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