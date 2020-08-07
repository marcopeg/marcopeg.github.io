VSCODE_VERSION=${1:-"3.1.1"}

# Save the starting point so the script can come back
PWD_START=$(pwd)

# Where to install VSCode
PWD_CODE=~/code-server

mkdir -p ${PWD_CODE}
cd ${PWD_CODE}

# Download & Extract
if [ ! -d "${PWD_CODE}/code-server-${VSCODE_VERSION}-linux-x86_64" ]; then
  wget https://github.com/cdr/code-server/releases/download/${VSCODE_VERSION}/code-server-${VSCODE_VERSION}-linux-x86_64.tar.gz
  tar -xzvf code-server-${VSCODE_VERSION}-linux-x86_64.tar.gz
fi

# Install command from the downloaded version
# cd code-server-${VSCODE_VERSION}-linux-x86_64
echo "Copy files..."
sudo rm -f /usr/bin/code-server
sudo rm -rf /usr/lib/code-server
sudo cp -R code-server-${VSCODE_VERSION}-linux-x86_64 /usr/lib/code-server
sudo ln -s /usr/lib/code-server/code-server /usr/bin/code-server

# Prepare the data folder
if [ ! -f "/var/lib/code-server" ]; then
  sudo mkdir -p /var/lib/code-server 
  sudo chown ubuntu /var/lib/code-server 
fi


###
### Replace the service file
###
sudo rm -f /lib/systemd/system/code-server.service
sudo tee -a /lib/systemd/system/code-server.service > /dev/null <<EOT
[Unit]
Description=code-server
After=nginx.service

[Service]
Type=simple
Environment=PASSWORD=foobar
ExecStart=/usr/bin/code-server --host 0.0.0.0 --user-data-dir /var/lib/code-server --auth password
Restart=always

[Install]
WantedBy=multi-user.target
EOT
sudo systemctl daemon-reload

# Go back to the starting point
cd ${PWD_START}
