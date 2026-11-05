-- Migration 002: produtos de exemplo para testar os filtros.
-- Os dados só são inseridos se a tabela produtos estiver vazia.

INSERT INTO produtos (nome, descricao, categoria, preco, estoque)
SELECT * FROM (
  SELECT 'Processador AMD Ryzen 5 5600' AS nome, '6 núcleos, 12 threads, socket AM4' AS descricao, 'processador' AS categoria, 899.90 AS preco, 15 AS estoque
  UNION ALL SELECT 'Processador Intel Core i5-12400F', '6 núcleos, 12 threads, socket LGA 1700', 'processador', 1049.90, 12
  UNION ALL SELECT 'Processador AMD Ryzen 7 5700X', '8 núcleos, 16 threads, socket AM4', 'processador', 1299.90, 8
  UNION ALL SELECT 'Processador Intel Core i3-12100F', '4 núcleos, 8 threads, socket LGA 1700', 'processador', 549.90, 20
  UNION ALL SELECT 'Placa-mãe ASUS Prime B550M-A', 'Chipset B550, socket AM4, mATX', 'placa-mae', 699.90, 10
  UNION ALL SELECT 'Placa-mãe Gigabyte B450M DS3H', 'Chipset B450, socket AM4, mATX', 'placa-mae', 449.90, 14
  UNION ALL SELECT 'Placa-mãe MSI A520M-A Pro', 'Chipset A520, socket AM4, mATX', 'placa-mae', 399.90, 18
  UNION ALL SELECT 'Memória Kingston Fury 8GB', 'DDR4 3200MHz, CL16', 'memoria', 189.90, 30
  UNION ALL SELECT 'Memória Corsair Vengeance 16GB', 'DDR4 3200MHz, CL16', 'memoria', 349.90, 22
  UNION ALL SELECT 'Memória XPG Gammix D10 32GB', 'DDR4 3200MHz, kit 2x16GB', 'memoria', 649.90, 9
  UNION ALL SELECT 'SSD Kingston NV2 500GB', 'NVMe PCIe 4.0, leitura até 3500MB/s', 'armazenamento', 259.90, 25
  UNION ALL SELECT 'SSD Samsung 980 1TB', 'NVMe PCIe 3.0, leitura até 3500MB/s', 'armazenamento', 499.90, 16
  UNION ALL SELECT 'HD Seagate Barracuda 2TB', '7200RPM, SATA III, 256MB de cache', 'armazenamento', 379.90, 11
  UNION ALL SELECT 'Placa de Vídeo NVIDIA RTX 3060 12GB', 'DLSS, ray tracing, GDDR6', 'placa-de-video', 1899.90, 6
  UNION ALL SELECT 'Placa de Vídeo AMD RX 6600 8GB', 'RDNA 2, GDDR6, ray tracing', 'placa-de-video', 1299.90, 7
  UNION ALL SELECT 'Placa de Vídeo NVIDIA GTX 1650 4GB', 'GDDR6, ideal para Full HD', 'placa-de-video', 899.90, 10
  UNION ALL SELECT 'Fonte Corsair CV550 550W', '80 Plus Bronze, PFC ativo', 'fonte', 329.90, 19
  UNION ALL SELECT 'Fonte XPG Pylon 650W', '80 Plus Bronze, PFC ativo', 'fonte', 399.90, 13
  UNION ALL SELECT 'Fonte Gamemax GP500 500W', '80 Plus Bronze, PFC ativo', 'fonte', 249.90, 24
  UNION ALL SELECT 'Gabinete Redragon Wideload', 'Mid tower, lateral em vidro, 3 fans', 'gabinete', 299.90, 12
  UNION ALL SELECT 'Gabinete Lian Li Lancool 216', 'Mid tower, lateral em vidro, 2 fans', 'gabinete', 599.90, 5
  UNION ALL SELECT 'Mouse Logitech G203', 'Sensor 8000 DPI, RGB', 'periferico', 149.90, 35
  UNION ALL SELECT 'Teclado Redragon Kumara', 'Mecânico, switch red, ABNT2', 'periferico', 199.90, 21
  UNION ALL SELECT 'Headset HyperX Cloud Stinger', 'Som surround 7.1 virtual', 'periferico', 279.90, 17
  UNION ALL SELECT 'Monitor LG 24MK430H 24"', 'IPS, Full HD, 75Hz', 'periferico', 799.90, 8
  UNION ALL SELECT 'Webcam Logitech C920', 'Full HD 1080p, 30fps', 'periferico', 449.90, 14
) AS produtos_exemplo
WHERE NOT EXISTS (SELECT 1 FROM produtos);
