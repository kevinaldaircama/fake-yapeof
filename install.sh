#!/bin/bash

SCRIPT="/usr/local/bin/yape"
BACKUP_DIR="/root/backups-yape"

function banner() {
clear
echo "====================================================="
echo "     PANEL PROFESIONAL - YAPE SERVER V5.0 FINAL      "
echo "====================================================="
}

function ip() {
  curl -s ifconfig.me
}

function verificar_nginx() {
  if ! command -v nginx &> /dev/null; then
    apt update -y
    apt install nginx -y
  fi

  if [ ! -f "/etc/nginx/nginx.conf" ]; then
    apt install --reinstall nginx -y
  fi
}

function renovar_ssl_auto() {
  (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet") | crontab -
}

function verificar_dns() {
  DOM=$1
  MIIP=$(ip)
  DNS=$(dig +short $DOM | tail -n1)

  if [[ "$DNS" == "$MIIP" ]]; then
    return 0
  else
    echo "❌ El dominio NO apunta a este servidor"
    echo "Tu IP: $MIIP"
    echo "El dominio apunta a: $DNS"
    exit 1
  fi
}

function instalar() {
banner

verificar_nginx

apt update -y
apt install git certbot python3-certbot-nginx dnsutils zip unzip -y

mkdir -p /var/www/html
mkdir -p $BACKUP_DIR

echo "Servidor listo: http://$(ip)"
}

function clonar_repo() {
banner

rm -rf /var/www/html/*
git clone https://github.com/kevinaldaircama/yape /var/www/html

echo "Repositorio instalado"
}

function dominio() {
banner

read -p "Ingresa tu dominio: " DOM

verificar_dns $DOM
verificar_dns "www.$DOM"

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
    server_name www.$DOM;

    ssl_certificate /etc/letsencrypt/live/$DOM/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOM/privkey.pem;

    return 301 https://$DOM\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOM;

    ssl_certificate /etc/letsencrypt/live/$DOM/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOM/privkey.pem;

    root /var/www/html;
    index index.html index.htm;

    location / {
        try_files \$uri \$uri.html \$uri/ /index.html;
    }
}
EOF

systemctl restart nginx

certbot --nginx -d $DOM -d www.$DOM --non-interactive --agree-tos -m admin@$DOM

renovar_ssl_auto

echo "SSL instalado correctamente en https://$DOM"
}

# ========== BACKUP ==========

function backup() {
banner

mkdir -p $BACKUP_DIR

FECHA=$(date +%d-%m-%Y_%H-%M-%S)

zip -r $BACKUP_DIR/backup_$FECHA.zip /var/www/html

echo "Backup creado:"
ls -lh $BACKUP_DIR
}

function restaurar() {
banner

echo "Backups disponibles:"
ls $BACKUP_DIR

read -p "Escribe el nombre del backup a restaurar: " BK

if [ -f "$BACKUP_DIR/$BK" ]; then
  rm -rf /var/www/html/*
  unzip $BACKUP_DIR/$BK -d /
  echo "Backup restaurado correctamente"
else
  echo "Backup no encontrado"
fi
}

function eliminar_backup() {
banner

echo "Backups disponibles:"
ls $BACKUP_DIR

read -p "Escribe el backup a eliminar: " BK

rm -f $BACKUP_DIR/$BK

echo "Backup eliminado"
}

# ========== SISTEMA ==========

function logs() {
banner
tail -f /var/log/nginx/error.log
}

function actualizar() {
banner
cd /var/www/html
git pull
echo "Proyecto actualizado"
}

function desinstalar() {
banner

echo "ELIMINANDO TODO EL SISTEMA..."

systemctl stop nginx
systemctl disable nginx

apt purge -y nginx nginx-common nginx-core
apt purge -y certbot python3-certbot-nginx

apt autoremove -y

rm -rf /etc/nginx
rm -rf /var/www/html
rm -rf /etc/letsencrypt
rm -rf $BACKUP_DIR
rm -f $SCRIPT

sed -i '/yape/d' ~/.bashrc
sed -i '/menu/d' ~/.bashrc

crontab -l | grep -v "certbot renew" | crontab -

echo "===================================="
echo " TODO FUE ELIMINADO COMPLETAMENTE"
echo "===================================="
}

function instalar_menu() {
cp $0 $SCRIPT
chmod +x $SCRIPT
echo "alias menu='$SCRIPT'" >> ~/.bashrc
source ~/.bashrc
}

function menu() {
banner

echo "1. Instalar servidor"
echo "2. Instalar repositorio"
echo "3. Configurar dominio + SSL (www)"
echo "4. Backup del sitio"
echo "5. Restaurar backup"
echo "6. Eliminar backup"
echo "7. Ver logs nginx"
echo "8. Actualizar proyecto"
echo "9. Desinstalar todo"
echo "10. Salir"
echo ""

read -p "Opción: " op

case $op in
1) instalar ;;
2) clonar_repo ;;
3) dominio ;;
4) backup ;;
5) restaurar ;;
6) eliminar_backup ;;
7) logs ;;
8) actualizar ;;
9) desinstalar ;;
10) exit ;;
*) echo "Opción inválida" ;;
esac
}

instalar_menu
menu
