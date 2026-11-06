-- Migration 003: imagens reais dos produtos.

ALTER TABLE produtos
  ADD COLUMN imagem VARCHAR(255) NULL AFTER descricao;

-- Cada produto recebe a fotografia correspondente ao seu modelo.
UPDATE produtos
   SET imagem = CASE
     WHEN nome = 'Processador AMD Ryzen 5 5600' THEN 'img/produtos/processador-amd-ryzen-5-5600.jpg'
     WHEN nome = 'Processador Intel Core i5-12400F' THEN 'img/produtos/processador-intel-core-i5-12400f.jpg'
     WHEN nome = 'Processador AMD Ryzen 7 5700X' THEN 'img/produtos/processador-amd-ryzen-7-5700x.jpg'
     WHEN nome = 'Processador Intel Core i3-12100F' THEN 'img/produtos/processador-intel-core-i3-12100f.jpg'
     WHEN nome = 'Placa-mãe ASUS Prime B550M-A' THEN 'img/produtos/placa-mae-asus-prime-b550m-a.jpg'
     WHEN nome = 'Placa-mãe Gigabyte B450M DS3H' THEN 'img/produtos/placa-mae-gigabyte-b450m-ds3h.jpg'
     WHEN nome = 'Placa-mãe MSI A520M-A Pro' THEN 'img/produtos/placa-mae-msi-a520m-a-pro.jpg'
     WHEN nome = 'Memória Kingston Fury 8GB' THEN 'img/produtos/memoria-kingston-fury-8gb.jpg'
     WHEN nome = 'Memória Corsair Vengeance 16GB' THEN 'img/produtos/memoria-corsair-vengeance-16gb.jpg'
     WHEN nome = 'Memória XPG Gammix D10 32GB' THEN 'img/produtos/memoria-xpg-gammix-d10-32gb.jpg'
     WHEN nome = 'SSD Kingston NV2 500GB' THEN 'img/produtos/ssd-kingston-nv2-500gb.jpg'
     WHEN nome = 'SSD Samsung 980 1TB' THEN 'img/produtos/ssd-samsung-980-1tb.jpg'
     WHEN nome = 'HD Seagate Barracuda 2TB' THEN 'img/produtos/hd-seagate-barracuda-2tb.jpg'
     WHEN nome = 'Placa de Vídeo NVIDIA RTX 3060 12GB' THEN 'img/produtos/placa-de-video-nvidia-rtx-3060-12gb.jpg'
     WHEN nome = 'Placa de Vídeo AMD RX 6600 8GB' THEN 'img/produtos/placa-de-video-amd-rx-6600-8gb.jpg'
     WHEN nome = 'Placa de Vídeo NVIDIA GTX 1650 4GB' THEN 'img/produtos/placa-de-video-nvidia-gtx-1650-4gb.jpg'
     WHEN nome = 'Fonte Corsair CV550 550W' THEN 'img/produtos/fonte-corsair-cv550-550w.jpg'
     WHEN nome = 'Fonte XPG Pylon 650W' THEN 'img/produtos/fonte-xpg-pylon-650w.jpg'
     WHEN nome = 'Fonte Gamemax GP500 500W' THEN 'img/produtos/fonte-gamemax-gp500-500w.jpg'
     WHEN nome = 'Gabinete Redragon Wideload' THEN 'img/produtos/gabinete-redragon-wideload.jpg'
     WHEN nome = 'Gabinete Lian Li Lancool 216' THEN 'img/produtos/gabinete-lian-li-lancool-216.jpg'
     WHEN nome = 'Mouse Logitech G203' THEN 'img/produtos/mouse-logitech-g203.jpg'
     WHEN nome = 'Teclado Redragon Kumara' THEN 'img/produtos/teclado-redragon-kumara.jpg'
     WHEN nome = 'Headset HyperX Cloud Stinger' THEN 'img/produtos/headset-hyperx-cloud-stinger.jpg'
     WHEN nome = 'Monitor LG 24MK430H 24"' THEN 'img/produtos/monitor-lg-24mk430h-24.jpg'
     WHEN nome = 'Webcam Logitech C920' THEN 'img/produtos/webcam-logitech-c920.jpg'
     ELSE 'img/produtos/sem-imagem.svg'
   END
 WHERE imagem IS NULL;
