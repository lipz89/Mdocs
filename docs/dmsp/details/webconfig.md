### appSettings参数

>该部分配置均配置在`configuration>appSettings`节点中，形式如下

``` xml
<add key="key" value="value"/>
```
#### AppVersionFilePath 
移动APP版本记录文件
>指示用以记录移动APP版本信息的文件地址

```xml
<add key="AppVersionFilePath" value="HCWZ.Download\AppVersion.txt"/>
```
#### EnableLoginMultiEndPoint 
启用单账号多点登录
>用以指示是否启用单账号多点登录，`true`为启用，其他值或不配置该节点为不启用

```xml
<add key="EnableLoginMultiEndPoint" value="true"/>
```
#### EnableAuditLog 
启用审计日志
>用以指示是否启用审计日志，`true`为启用，其他值或不配置该节点为不启用；
启用后会会将每个请求和每个和DEP平台交互的请求的地址，参数，结果等信息记录在数据库`AuditLogs`表中；
启用后会增加数据库的压力，有可能导致数据库日志文件增长速度过快；
<font color=red>不建议启用该项</font>
<font color=red>如果启用该项，请设置数据库日志文件自动收缩</font>

```xml
<add key="EnableAuditLog" value="false"/>
```
>历史审计日志会定期删除，只保留70天以内的
#### ValidateCodeType 
配置系统验证码字符类型
>用以配置系统验证码字符类型，具体配置如下：
1:纯数字，2:纯字母，其他或不配置：字母加数字

```xml
<add key="ValidateCodeType" value="1"/>
```
#### SiteHost 
配置当前站点的域名及地址
>只有当物资云不作为一级域名发布时使用；
<font color=red>物资云作为一级域名发布时一定不要配置该项</font>

```xml
<add key="SiteHost" value="http://localhost:9070/hcwz/"/>
```
#### DisableLoginValidCode 
登录时是否禁止检查验证码
>指示登录时是否禁止检查验证码，`true`为不检查，其他值或不配置该节点为检查；
<font color=red>该配置项是提供给自动化测试时使用，其他场景请勿配置</font>

```xml
<add key="DisableLoginValidCode" value="true"/>
```

### 锁定策略配置
用户频繁登录错误时对用户或IP进行锁定的策略，用于防止暴力破解密码
该配置分为两部分
#### 节点注册配置
配置路径：`configuration>configSections`
配置内容：

```xml
<section name="strategies" type="Winning.DMSP.Application.ServiceContracts.LockStrategySection,Winning.DMSP.ServiceContracts"/>
```
配置说明 ：
>该配置定义下面详细策略配置的解析类，没有本配置下面的配置不会生效
#### 详细策略配置
配置路径：`configuration>strategies`
配置内容：

```xml
<add type="IP" timespan="2H" errorcount="20" timespanlock="1D"/>
<add type="User" timespan="2H" errorcount="5" timespanlock="2H"/>
```
配置说明 ：
>类型type包含IP和User两种，分别代表同一IP和同一用户，
timespan是连续的时间段；
errorcount是连续错误的次数；
timespanlock是锁定的时长；
其中timespan和timespanlock的格式为数字加字母，
字母包括S-秒，M-分钟，H-小时，D-天，F-永久
以`<add type="IP" timespan="2H" errorcount="20" timespanlock="1D"/>`为例，
表示同一IP地址在2小时内连续错误达到20次将被锁定1天时间

>注：1. 超级用户admin不会被锁定，2. IP或User被锁定后，超级管理员admin可在锁定信息页面进行查看和解锁

以下错误情况被计入登录错误次数：
>用户名或密码不正确；
如被系统识别为其他模拟的非法请求，

以下错误情况不被计入登录错误次数：
>验证码错误；
在锁定状态下进行的登录错误

策略判定逻辑：
1. 将所有策略以错误次数从小到大排序
2. 逐一判定策略，若满足锁定条件，执行锁定策略
    当同时有多个策略满足条件，只按第一个满足条件的策略锁定
3. 无满足条件的策略，返回剩余可重试次数
