
### 登录用例
1. 访问Login.html页面
2. 用户填写用户名，密码，[验证码](#验证码获取)
3. 前端js验证输入有效性
4. 单击“登录”按钮，将请求提交到`/webapi/v1/UserInfo/login`
5. 后台登陆验证流程
6. 后台验证成功，跳转到main.html
    后台验证失败，提示失败信息

### 验证码获取
验证码图片是后台的一个请求，请求地址：
```html
<img src="/webapi/v1/Util/ValidateCode?s=login&_d=1569393561350">
```
>参数s是验证码类型；
参数_d是当前时间戳，用于保证不使用缓存请求结果

后端收到验证码请求，会生成一个token，并将该token保存到名称为“DMSPNetHMac_”+s(本例中为DMSPNetHMac_login)的cookie中以供前端使用，同时生成一个验证码并将该验证码生成图片，将该图片的二级制数据写进请求的响应结果中
前端收到的响应并展示在页面上。

### 整体登陆验证流程
1. 用户单击“登录”按钮；
2. 前端js获取cookie中DMSPNetHMac_login的token；
3. js将密码加密；
4. js获取当前时间戳，并将时间戳和token一起加密为hash；
5. 将表单元素值和计算结果组成以下结构：
    ```json
    {
        "LoginName":"admin",
        "Pwd":"06ee915a81fb1707fe44a02b83d340be","ValidCode":"ffff","Token":"597b03ad8e9e4d06a8e82f1c27f87cf0","Tick":1569393659312,
        "Version":"3","Hash":"61d73a2df335f2c27496583af06222bc","RememberMe":false
        }
    ```
    以上各值意义如下：
    |字段名称|说明|
    |:--|:--|
    |LoginName|用户名|
    |Pwd|加密后的密码|
    |ValidCode|验证码|
    |Token|token，`cookie['DMSPNetHMac_login']`的值|
    |Tick|当前时间戳|
    |Version|版本号|
    |Hash|hash|
    |RememberMe|是否记住登录状态，记住后一周内免登陆，否则20分钟后登录失效|
6. 将以上json数据提交到`/webapi/v1/UserInfo/login`
7. 后台收到登录请求，验证请求参数，以下任一验证失败均返回登录失败
    a. 验证当前用户或IP是否被锁定
    b. 验证用户名和密码是否为有效字符串
    c. 验证token是否有效
    d. 验证验证码是否正确
    e. 验证用户标识`userAgent`是否和请求验证码时的用户标识`userAgent`一致
    f. 验证hash是否有效
    g. 验证用户名和密码是否对应数据库的用户记录
    h. 验证用户当时被冻结
8. 若验证失败，记录失败信息，并执行锁定策略
9. 若全部验证通过，登录成功，
    a. 将登录记录到表[`LoginRecords`](#登录记录表)，
    b. 将登录记录加密作为会话标识放入响应的头信息中
    c. 返回用户信息和菜单信息,
    d. 前端从请求响应中获取会话标识

### 登录流程其他说明
1. 若未启用单账号多点登录，每个用户只有最后一次登录有效，之前的登录会提示用户在别处登录，并强制失效
2. 登录成功后会强制中断当前用户的所有找回密码流程

### 其他请求验证流程
>只有设置了`IAuthAttribute`过滤器的请求会进行以下验证

1. 前端将登录时获取的会话标识放入请求头`LoginUserToken`中
2. 发送请求
3. 后端从请求头中获取会话标识`LoginUserToken`，开始验证流程
    a. 验证会话标识信息
    b. 解密会话标识信息，根据会话标识信息获取登录记录，
    c. 验证会话标识和登录记录
    d. 验证登录是否已经失效
    e. 验证当前用户是否已经在别处登录
4. 若任一验证失败，中止请求
5. 若验证成功，更新会话失效时间，执行后续业务请求

### 登录记录表LoginRecords

|字段名|类型|说明|
|:--|:--|:--|
|ID|VARCHAR(36)|主键|
|UserID|VARCHAR](36)|用户ID|
|UserName|VARCHAR(64)|用户名|
|LoginToken|VARCHAR(128)|登录标识|
|SessionToken|VARCHAR(128)|会话标识|
|UserAgent|VARCHAR(256)|用户请求标识|
|ClientIP|VARCHAR(32)|客户端IP地址|
|ClientHostName|VARCHAR(64) |客户端主机名称|
|LoginTime|DATETIME |登录时间|
|ExpiryTime|DATETIME |失效时间|
|IsRemembered|BIT |是否记住登录状态|
|IsMandatoryExpiration|BIT|是否已经失效|
|MandatoryExpirationTime|DATETIME|强制失效时间|
|CreateTime|DATETIME|记录创建时间|


### 找回密码流程
1. 用户在登录页面点击“找回密码”按钮
2. 跳转到FindPassword.html页面
3. 用户填写用户名和验证码，单击“确定”按钮
4. 后端检查验证码是否有效，验证用户名是否存在，验证失败中断流程
5. 用户填写用户预留的邮箱地址
6. 后端验证用户填写的邮箱是否与预留的邮箱一致，如果不一致，中断流程
7. 生成一条找回密码的记录保存到表[`FindPwdRecords`](#找回密码记录)，
8. 发送一个定时失效的重设密码的连接到用户邮箱，
9. 用户从邮箱访问重设密码的连接，
10. 后端验证该连接的有效性，若连接无效，中断流程
11. 连接有效，则展示重设密码的界面
12. 用户两次填写一致的密码，并单击“确定”按钮
13. 重设密码成功，强制使当前的找回密码记录失效

### 找回密码记录FindPwdRecords
|字段名	|类型	|描述	|
|:--|:--|:--|
|ID	|VARCHAR(36)	|主键	|
|UserID	|VARCHAR(36)	|用户ID	|
|UserName|	VARCHAR(64)	|用户名	|
|Token|VARCHAR(128)|找回密码的凭证	通过随机算法生成的无重复字串|
|Email|VARCHAR(128)|邮箱	|
|CreateTime|	DATETIME|	发起时间	|
|ExpiryTime|	DATETIME|	失效时间	|
|IsExpiried|	BIT	|状态	0正常，1已失效|

### 其他说明
系统会在每次用户登录时清除一部分历史数据，清除内容包括：
1. 70天以前的登录记录，
2. 70天以前的审计日志
3. 锁定策略最长时间段以前的登录错误记录
4. 锁定策略最长时间段以前的用户锁定记录

>因为每次登录都有这个操作，所以每次操作都不会有太多需要删除的数据，对效率的影响相对于网络传输速度的影响来说可以忽略不记


