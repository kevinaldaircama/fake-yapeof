#!/bin/bash

# ===== VALIDAR UBUNTU =====
if [ -f /etc/os-release ]; then
  . /etc/os-release
  echo "🖥️ Sistema detectado: $NAME $VERSION_ID"

  if [[ "$ID" != "ubuntu" ]]; then
    echo "❌ Este script solo funciona en Ubuntu"
    exit 1
  fi

  VERSION_OK=("18.04" "20.04" "22.04" "24.04")

  if [[ ! " ${VERSION_OK[@]} " =~ " ${VERSION_ID} " ]]; then
    echo "❌ Versión no soportada: $VERSION_ID"
    exit 1
  fi
else
  echo "❌ No se pudo detectar el sistema"
  exit 1
fi

SCRIPT="/usr/local/bin/yape"
REPO="https://github.com/kevinaldaircama/yape"
RAW="https://raw.githubusercontent.com/kevinaldaircama/yape/main/setup.sh"

# ===== COLORES =====
verde="\e[32m"
rojo="\e[31m"
azul="\e[34m"
reset="\e[0m"

function banner() {
clear
echo -e "${azul}"
echo "====================================================="
echo "        YAPE SERVER INSTALLER ⚡ FULL PRO v8          "
echo "====================================================="
echo -e "${reset}"
}

# ===== LOADING =====
function loading() {
echo -ne "${verde}Instalando"
for i in {1..5}; do
  echo -ne "."
  sleep 0.4
done
echo -e "${reset}"
}

# ===== INSTALAR SCRIPT GLOBAL =====
function instalar_script() {
cp $0 $SCRIPT
chmod +x $SCRIPT
grep -qxF "alias menu='$SCRIPT'" ~/.bashrc || echo "alias menu='$SCRIPT'" >> ~/.bashrc
source ~/.bashrc
}

# ===== INSTALAR REPO =====
function instalar_repo() {
rm -rf /var/www/html/*
git clone $REPO /var/www/html
}

# ===== CONFIGURAR DOMINIO + SSL =====
function dominio_ssl() {
read -p "🌐 Ingresa tu dominio: " DOM

loading

cat > /etc/nginx/sites-available/default <<EOF
server {
    listen 80;
    server_name $DOM www.$DOM;

    location / {
        return 301 https://$DOM\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name $DOM;

    ssl_certificate /etc/letsencrypt/live/$DOM/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOM/privkey.pem;

    root /var/www/html;
    index index.html;

    location / {
        try_files \$uri \$uri.html \$uri/ /index.html;
    }
}
EOF

systemctl restart nginx

certbot --nginx -d $DOM -d www.$DOM --non-interactive --agree-tos -m admin@$DOM

echo -e "${verde}✅ SSL activo en https://$DOM${reset}"
}

# ===== ACTUALIZAR =====
function actualizar() {
banner
echo "🔄 Actualizando..."

wget -q $RAW -O $SCRIPT
chmod +x $SCRIPT

echo -e "${verde}✅ Script actualizado${reset}"
sleep 2
menu
}

# ===== INSTALACIÓN COMPLETA =====
function instalar_todo() {
banner

echo "🚀 Instalando servidor completo..."
loading

apt update -y
apt install -y nginx git curl certbot python3-certbot-nginx zip unzip dnsutils

systemctl enable nginx
systemctl start nginx

mkdir -p /var/www/html

instalar_repo
instalar_script

echo -e "${verde}✅ Servidor instalado${reset}"

dominio_ssl

echo -e "${verde}🎉 TODO LISTO${reset}"
sleep 2
menu
}

# ===== MENU =====
function menu() {
banner

echo "1. Reinstalar sistema"
echo "2. Actualizar script"
echo "3. Salir"
echo ""

read -p "Opción: " op

case $op in
1) instalar_todo ;;
2) actualizar ;;
3) exit ;;
*) echo "❌ Opción inválida"; menu ;;
esac
}

# ===== ARGUMENTOS =====
case "$1" in
--update)
actualizar
;;
--start)
menu
;;
*)
instalar_todo
;;
esac
