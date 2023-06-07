

echo "installing cron"
sudo apt update
sudo apt install cron

echo "making sure cron runs after reboot"
sudo update-rc.d cron defaults

echo "checking cron status"
systemctl status cron

echo "checking existing crontabs"
crontab -u dev -l
sudo crontab -r -u dev

echo "installing cron tab for dns"
crontab -u dev -l > devcron
dnscron="python3 ~/Webdep/DNSdep/get_dns_details_all.py > /home/dev/cron-logs/dns-cron.log 2>&1"
cacron="python3 ~/Webdep/CAdep/get_ca_details_all.py > /home/dev/cron-logs/ca-cron.log 2>&1"
cdncron1="python3 ~/Webdep/CDNdep/get_cdn_details_all.py 0 2000 > /home/dev/cron-logs/cdn-cron.log 2>&1"
cdncron2="python3 ~/Webdep/CDNdep/get_cdn_details_all.py 2000 4000 > /home/dev/cron-logs/cdn-cron.log 2>&1"
cdncron3="python3 ~/Webdep/CDNdep/get_cdn_details_all.py 4000 6000 > /home/dev/cron-logs/cdn-cron.log 2>&1"
cdncron4="python3 ~/Webdep/CDNdep/get_cdn_details_all.py 6000 8000 > /home/dev/cron-logs/cdn-cron.log 2>&1"
cdncron5="python3 ~/Webdep/CDNdep/get_cdn_details_all.py 8000 10000 > /home/dev/cron-logs/cdn-cron.log 2>&1"


echo "0 0 1 * * $dnscron" >> devcron
echo "0 0 3 * * $cacron" >> devcron
echo "0 0 5 * * $cdncron1" >> devcron
echo "0 0 7 * * $cdncron2" >> devcron
echo "0 0 9 * * $cdncron3" >> devcron
echo "0 0 11 * * $cdncron4" >> devcron
echo "0 0 13 * * $cdncron5" >> devcron

#install new cron file
crontab devcron
rm devcron






