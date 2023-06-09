
mydate=$(date +'%Y')
LAST_2MONTH=`date -d "$(date +%Y-%m-1) -2 month" +%m`
suffix="${mydate}${LAST_2MONTH}"
echo "current year $mydate, and second last month ${LAST_2MONTH} and the suffix is ${suffix}"

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

mkdir ~/cron-logs
echo "installing cron tab for dns"
crontab -u dev -l > devcron
dnscron="screen -dm -L -Logfile ~/measurements-logs/dns.log -S dns python3 ~/Webdep/DNSdep/get_dns_details_all.py > ~/cron-logs/dns-cron.log 2>&1"
cacron="screen -dm -L -Logfile ~/measurements-logs/ca.log -S ca python3 ~/Webdep/CAdep/get_ca_details_all.py > ~/cron-logs/ca-cron.log 2>&1"
cdncron1="screen -dm -L -Logfile ~/measurements-logs/cdn.log -S cdn  python3 ~/Webdep/CDNdep/get_cdn_details_all.py 0 2000 > ~cron-logs/cdn-cron.log 2>&1"
cdncron2="screen -dm -L -Logfile ~/measurements-logs/cdn.log -S cdn python3 ~/Webdep/CDNdep/get_cdn_details_all.py 2000 4000 > ~/cron-logs/cdn-cron.log 2>&1"
cdncron3="screen -dm -L -Logfile ~/measurements-logs/cdn.log -S cdn python3 ~/Webdep/CDNdep/get_cdn_details_all.py 4000 6000 > ~/cron-logs/cdn-cron.log 2>&1"
cdncron4="screen -dm -L -Logfile ~/measurements-logs/cdn.log -S cdn python3 ~/Webdep/CDNdep/get_cdn_details_all.py 6000 8000 > ~/cron-logs/cdn-cron.log 2>&1"
cdncron5="screen -dm -L -Logfile ~/measurements-logs/cdn.log -S cdn python3 ~/Webdep/CDNdep/get_cdn_details_all.py 8000 10000 > ~/cron-logs/cdn-cron.log 2>&1"


boxcron1="python3 ~/Web-Dependencies/measurements/upload_to_box.py ~/Webdep/DNSdep/us-dns-${suffix} us-dns-${suffix} > /home/dev/cron-logs/box-cron.log 2>&1"
boxcron2="python3 ~/Web-Dependencies/measurements/upload_to_box.py ~/Webdep/CDNdep/us-cdn-${suffix} us-dns-${suffix} > /home/dev/cron-logs/box-cron.log 2>&1"
boxcron3="python3 ~/Web-Dependencies/measurements/upload_to_box.py ~/Webdep/CAdep/us-ocsp-${suffix} us-ocsp-${suffix} > /home/dev/cron-logs/box-cron.log 2>&1"

echo "0 0 1 * * $dnscron" >> devcron
echo "0 0 3 * * $cacron" >> devcron
echo "0 0 5 * * $cdncron1" >> devcron
echo "0 0 7 * * $cdncron2" >> devcron
echo "0 0 9 * * $cdncron3" >> devcron
echo "0 0 11 * * $cdncron4" >> devcron
echo "0 0 13 * * $cdncron5" >> devcron
echo "0 0 20 * * $boxcron1" >> devcron
echo "0 0 20 * * $boxcron2" >> devcron
echo "0 0 20 * * $boxcron3" >> devcron

#install new cron file
crontab devcron
rm devcron





