echo off 
::ָ����ʼ�ļ���
set DIR="%cd%"
set pre=loadLanguages^('
set suf='^);
echo DIR=%DIR%

:: ���� /R ��ʾ��Ҫ�������ļ���,ȥ����ʾ���������ļ���
:: %%f ��һ������,�����ڵ�����,�����������ֻ����һ����ĸ���,ǰ�����%%
:: ��������ͨ���,����ָ����׺��,*.*��ʾ�����ļ�
for /R %DIR% %%f in (*.js) do ( 

    echo loadLanguages^('%%~nf'^);
)
pause