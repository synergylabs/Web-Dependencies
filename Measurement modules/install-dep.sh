


# installing git
echo "installing git"
sudo apt update
sudo apt install git

# clone repo
if [ ! -d "$DIRECTORY" ]; then
  echo "$DIRECTORY does not exist. Cloning https://github.com/AqsaKashaf/Webdep.git"
  git clone https://github.com/AqsaKashaf/Webdep.git
fi


# install nodejs
echo "Installing nodejs"
sudo apt-get -y install libnss3 libxss1 libasound2 libatk-bridge2.0-0 libgtk-3-0 libgbm-dev
cd ~
curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh
sudo apt install -y nodejs

# installing python3.8
echo "installing python3.8"
sudo apt install python3.8
python3 --version

# install puppeteer
echo "installing puppeteer and puppeteer-har"
npm install puppeteer
npm install puppeteer-har


# install python-pip
echo "installing python3-pip"
sudo apt install python3-pip


echo "installing pipenv"
pip3 install pipenv



sudo apt-get update
sudo apt-get -y install apt-transport-https ca-certificates gnupg curl sudo

echo "deb https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
sudo apt-get update && sudo apt-get -y install google-cloud-cli
gcloud auth application-default login


cd Webdep
pipenv install

