@echo off
cd C:\Users\nguye\Downloads\webthuvienn
:loop
php artisan books:process-quantity-changes
timeout /t 5 /nobreak
goto loop 