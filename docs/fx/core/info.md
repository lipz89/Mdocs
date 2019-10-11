## 框架核心

    QuickShare.LiteFramework 为核心类库
    QuickShare.LiteFramework.Data 为数据库支持模块
    QuickShare.LiteFramework.WebApi 为webapi服务支持模块

### QuickShare.LiteFramework

|命名空间|说明|
|:--|:--|
| QuickShare.LiteFramework.Base|框架基类或契约接口|
| QuickShare.LiteFramework.Common|工具类库，扩展方法|
| QuickShare.LiteFramework.Data|数据库支持契约|
| QuickShare.LiteFramework.Foundation|基础设施|
| QuickShare.LiteFramework.Inject|依赖注入功能|
| QuickShare.LiteFramework.Mapper|模型映射契约|
| QuickShare.LiteFramework.Model|基础模型|
| QuickShare.LiteFramework.ConfigUI|配置工具契约及扩展方法|

AppInstance类为应用程序实例类，是本框架的入口，其中包含对依赖注入服务的封装

### QuickShare.LiteFramework.Data

    该类库主要是对QuickShare.LiteFramework类库中QuickShare.LiteFramework.Data命名空间的实现。

### QuickShare.LiteFramework.WebApi

    为webapi服务提供支持

#### WebApiInstance  
    AppInstance的派生类，重写了获取依赖注入服务的方法，重写的目的是为了保证从当前请求的生命周期获取。

在Global.asax.cs文件中增加下列代码即可运行：
```C#
        protected override void Application_Start(object sender, EventArgs e)
        {
            GlobalConfiguration.Configuration
                .ConfigAppInstance(Config)
                .UseErrorHandler()//开启错误处理过滤器
                .UseFilter(new ApiAuthFilter())//开启权限过滤器
                .UseHttpAttributeRoutes()//通过Route特性注册路由
                .UseXml(false)//关闭XML序列化
                .UseJson(camelCaseProperty: true)//开启JSON序列化
                .StartTasks()//运行时先执行自动任务
                .Run();
        }

        private void Config(AppInstance appInstance)
        {
            appInstance
                .UseTinyMapper(IsPropertyNameMatch)//模型映射插件
                .UseEventBus()//事件总线
                .UseReport("ReportTpls")//报表插件
                .UseFileStore("Files")//文件系统
                .UseScriptPatcher("App_Data")//增量脚本
                .UseAuditLog(GlobalConfiguration.Configuration)//审计日志
                ;
        }
```