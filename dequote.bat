@echo off

shift

:run
py dequoter.py %0

shift
if [%0]==[] goto end

goto run

:end
exit /B 0