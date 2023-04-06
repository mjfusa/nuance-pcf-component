REM Update publisherName and publisherPrefix below for your environment
set publisherName=WeHealth
set publisherPrefix=wh
set solutionName=NuancePCFComponentSolution
set controlName=SpeechToTextControl

rmdir /s /q %solutionName%
md %solutionName%
cd %solutionName%
cmd /c pac solution init --publisher-name %publisherName% --publisher-prefix %publisherPrefix%
cmd /c pac solution add-reference --path ..
msbuild /t:build /restore
if "%1"=="push" goto push
goto end
:push
cd ..
cmd /c pac pcf version --strategy manifest
cmd /c pac pcf push --publisher-prefix %publisherPrefix%
:end
cd ..