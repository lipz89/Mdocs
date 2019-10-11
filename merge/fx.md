<h1 style="text-align:center">LiteFramework框架说明</h1>

|作者|lpz|
|:--|--:|
|版本|1.0.0|
|版权|©2019, 快享医疗.|
<div STYLE="page-break-after: always;"></div>
<h4><a href="#olizHPnA" title="简介">1 简介</a></h2>
<h4><a href="#NIRvOUgq" title="框架核心">2 框架核心</a></h2>
<h4><a href="#jGUnHTXy" title="框架核心简介">2.1 框架核心简介</a></h2>
<h4><a href="#YBxjDmus" title="框架依赖">2.2 框架依赖</a></h2>
<h4><a href="#sbeowuMt" title="AppInstance">2.3 AppInstance</a></h2>
<h4><a href="#klQepTZV" title="服务核心">3 服务核心</a></h2>
<h4><a href="#qkceoJga" title="框架依赖">3.1 框架依赖</a></h2>
<h4><a href="#NKUrQhOd" title="IService">3.2 IService</a></h2>
<h4><a href="#eGEzowOb" title="插件">4 插件</a></h2>
<h4><a href="#XnGfIpBQ" title="简介">4.1 简介</a></h2>
<h4><a href="#FgWMEBPf" title="已提供插件">4.2 已提供插件</a></h2>
<h4><a href="#NQGMLyOW" title="部分核心技术实现详细说明">5 部分核心技术实现详细说明</a></h2>
<h4><a href="#uKMcJCon" title="简介">5.1 简介</a></h2>
<h4><a href="#KCNAjbmD" title="已提供插件">5.2 已提供插件</a></h2>
<div STYLE="page-break-after: always;"></div>
<h2 id="olizHPnA">1 简介</h2>

## QuickShare.LiteFramework

>本文档持续更新中。

QuickShare.LiteFramework框架为插件化模块化框架。
>其中包含框架核心，服务核心，应用配置工具，服务管理工具，插件，模块等概念。
### 框架核心
主要包含系统基础模块，及系统依赖注入。主要包括项目：

    QuickShare.LiteFramework
    QuickShare.LiteFramework.Data
    QuickShare.LiteFramework.WebApi
    QuickShare.LiteFramework.ConfigTool
### 服务核心
对于windows服务的封装，服务核心依赖于框架核心。主要包括项目：

    QuickShare.Cloud.WinServer
    QuickShare.Cloud.WinServer.Foundation
    QuickShare.Cloud.WinServer.Config
### 插件
功能化组件。工具类插件，如日志，邮件，短信，等。
### 模块
业务功能模块。业务类模块。

>本文档持续更新中。
<h2 id="NIRvOUgq">2 框架核心</h2>

<h2 id="jGUnHTXy">2.1 框架核心简介</h2>

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
<h2 id="YBxjDmus">2.2 框架依赖</h2>

## QuickShare.LiteFramework依赖项目

|名称|版本|
|:--|:--|
|Autofac|4.3.0.0|
|Autofac.Configuration|4.0.1.0|
|Autofac.Extras.DynamicProxy|4.4.0.0|
|Castle.Core|4.0.0.0|
|EntityFramework|6.0.0.0|
|Newtonsoft.Json|10.0.0.0|
    
## QuickShare.LiteFramework.Data依赖项目

|名称|版本|
|:--|:--|
|EntityFramework|6.0.0.0|
|EntityFramework.SqlServer|6.0.0.0|
|Oracle.ManagedDataAccess|4.121.2.0|
|QuickShare.LiteFramework|--|
    
## QuickShare.LiteFramework.WebApi依赖项目

|名称|版本|
|:--|:--|
|Autofac|4.3.0.0|
|Autofac.Integration.Mvc|4.0.0.0|
|Autofac.Integration.WebApi|4.0.0.0|
|Autofac.Extras.DynamicProxy|4.4.0.0|
|Castle.Core|4.0.0.0|
|EntityFramework|6.0.0.0|
|Newtonsoft.Json|10.0.0.0|
|System.Net.Http.Formatting|5.2.3.0|
|System.Web.Cors|5.2.3.0|
|System.Web.Http|5.2.3.0|
|System.Web.Http.Cors|5.2.3.0|
|System.Web.Http.WebHost|5.2.3.0|
|System.Web.Mvc|5.2.3.0|
|QuickShare.LiteFramework|--|
  



<h2 id="sbeowuMt">2.3 AppInstance</h2>


<h2 id="klQepTZV">3 服务核心</h2>

<h2 id="qkceoJga">3.1 框架依赖</h2>


<h2 id="NKUrQhOd">3.2 IService</h2>


<h2 id="eGEzowOb">4 插件</h2>

<h2 id="XnGfIpBQ">4.1 简介</h2>


<h2 id="FgWMEBPf">4.2 已提供插件</h2>


<h2 id="NQGMLyOW">5 部分核心技术实现详细说明</h2>

<h2 id="uKMcJCon">5.1 简介</h2>

<h2 id="KCNAjbmD">5.2 已提供插件</h2>

