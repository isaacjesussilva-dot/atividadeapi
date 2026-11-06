-- Migration 004: fotos reais dos produtos.
-- Substitui as ilustrações SVG por fotografias correspondentes a cada produto.

UPDATE produtos SET imagem = 'img/produtos/processador-amd-ryzen-5-5600.jpg'         WHERE nome = 'Processador AMD Ryzen 5 5600';
UPDATE produtos SET imagem = 'img/produtos/processador-intel-core-i5-12400f.jpg'     WHERE nome = 'Processador Intel Core i5-12400F';
UPDATE produtos SET imagem = 'img/produtos/processador-amd-ryzen-7-5700x.jpg'         WHERE nome = 'Processador AMD Ryzen 7 5700X';
UPDATE produtos SET imagem = 'img/produtos/processador-intel-core-i3-12100f.jpg'     WHERE nome = 'Processador Intel Core i3-12100F';
UPDATE produtos SET imagem = 'img/produtos/placa-mae-asus-prime-b550m-a.jpg'         WHERE nome = 'Placa-mãe ASUS Prime B550M-A';
UPDATE produtos SET imagem = 'img/produtos/placa-mae-gigabyte-b450m-ds3h.jpg'        WHERE nome = 'Placa-mãe Gigabyte B450M DS3H';
UPDATE produtos SET imagem = 'img/produtos/placa-mae-msi-a520m-a-pro.jpg'            WHERE nome = 'Placa-mãe MSI A520M-A Pro';
UPDATE produtos SET imagem = 'img/produtos/memoria-kingston-fury-8gb.jpg'            WHERE nome = 'Memória Kingston Fury 8GB';
UPDATE produtos SET imagem = 'img/produtos/memoria-corsair-vengeance-16gb.jpg'       WHERE nome = 'Memória Corsair Vengeance 16GB';
UPDATE produtos SET imagem = 'img/produtos/memoria-xpg-gammix-d10-32gb.jpg'          WHERE nome = 'Memória XPG Gammix D10 32GB';
UPDATE produtos SET imagem = 'img/produtos/ssd-kingston-nv2-500gb.jpg'               WHERE nome = 'SSD Kingston NV2 500GB';
UPDATE produtos SET imagem = 'img/produtos/ssd-samsung-980-1tb.jpg'                  WHERE nome = 'SSD Samsung 980 1TB';
UPDATE produtos SET imagem = 'img/produtos/hd-seagate-barracuda-2tb.jpg'             WHERE nome = 'HD Seagate Barracuda 2TB';
UPDATE produtos SET imagem = 'img/produtos/placa-de-video-nvidia-rtx-3060-12gb.jpg'  WHERE nome = 'Placa de Vídeo NVIDIA RTX 3060 12GB';
UPDATE produtos SET imagem = 'img/produtos/placa-de-video-amd-rx-6600-8gb.jpg'       WHERE nome = 'Placa de Vídeo AMD RX 6600 8GB';
UPDATE produtos SET imagem = 'img/produtos/placa-de-video-nvidia-gtx-1650-4gb.jpg'   WHERE nome = 'Placa de Vídeo NVIDIA GTX 1650 4GB';
UPDATE produtos SET imagem = 'img/produtos/fonte-corsair-cv550-550w.jpg'             WHERE nome = 'Fonte Corsair CV550 550W';
UPDATE produtos SET imagem = 'img/produtos/fonte-xpg-pylon-650w.jpg'                 WHERE nome = 'Fonte XPG Pylon 650W';
UPDATE produtos SET imagem = 'img/produtos/fonte-gamemax-gp500-500w.jpg'             WHERE nome = 'Fonte Gamemax GP500 500W';
UPDATE produtos SET imagem = 'img/produtos/gabinete-redragon-wideload.jpg'           WHERE nome = 'Gabinete Redragon Wideload';
UPDATE produtos SET imagem = 'img/produtos/gabinete-lian-li-lancool-216.jpg'         WHERE nome = 'Gabinete Lian Li Lancool 216';
UPDATE produtos SET imagem = 'img/produtos/mouse-logitech-g203.jpg'                  WHERE nome = 'Mouse Logitech G203';
UPDATE produtos SET imagem = 'img/produtos/teclado-redragon-kumara.jpg'              WHERE nome = 'Teclado Redragon Kumara';
UPDATE produtos SET imagem = 'img/produtos/headset-hyperx-cloud-stinger.jpg'         WHERE nome = 'Headset HyperX Cloud Stinger';
UPDATE produtos SET imagem = 'img/produtos/monitor-lg-24mk430h-24.jpg'               WHERE nome = 'Monitor LG 24MK430H 24"';
UPDATE produtos SET imagem = 'img/produtos/webcam-logitech-c920.jpg'                 WHERE nome = 'Webcam Logitech C920';
