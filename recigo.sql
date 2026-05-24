-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-05-2026 a las 01:59:21
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `recigo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canjes`
--

CREATE TABLE `canjes` (
  `id_canje` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nombre_recompensa` varchar(100) NOT NULL,
  `puntos_costo` decimal(10,2) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `canjes`
--

INSERT INTO `canjes` (`id_canje`, `id_usuario`, `nombre_recompensa`, `puntos_costo`, `fecha`) VALUES
(1, 1, 'Entrada cine 2x1', 1000.00, '2026-05-23 20:55:24'),
(2, 1, 'Tarjeta Spotify $10', 800.00, '2026-05-23 20:55:28'),
(3, 1, 'Tarjeta $25.000 Dollarcity', 1500.00, '2026-05-23 20:55:39'),
(4, 1, 'Tarjeta Amazon $5', 500.00, '2026-05-23 20:56:09'),
(5, 1, 'Entrada cine 2x1', 1000.00, '2026-05-23 21:02:14'),
(6, 1, 'Tarjeta Amazon $5', 500.00, '2026-05-23 21:02:32'),
(7, 1, 'Entrada cine 2x1', 1000.00, '2026-05-23 21:31:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `puntos_por_unidad` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`, `puntos_por_unidad`) VALUES
(1, 'Plastico', 2.00),
(2, 'Carton', 1.50),
(3, 'Vidrio', 3.00),
(4, 'Metal', 4.00),
(5, 'Organico', 1.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntos`
--

CREATE TABLE `puntos` (
  `id_punto` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_registro` int(11) DEFAULT NULL,
  `puntos` decimal(10,2) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `puntos`
--

INSERT INTO `puntos` (`id_punto`, `id_usuario`, `id_registro`, `puntos`, `fecha`) VALUES
(1, 1, 1, 10.00, '2026-05-22 06:55:39'),
(2, 1, 2, 20.00, '2026-05-22 06:56:38'),
(3, 1, 3, 20.00, '2026-05-23 20:17:44'),
(4, 1, 4, 19.50, '2026-05-23 20:18:07'),
(5, 1, 5, 3702.00, '2026-05-23 20:45:21'),
(6, 1, 6, 600.00, '2026-05-23 20:55:55'),
(7, 1, 7, 900.00, '2026-05-23 21:00:24'),
(8, 1, 8, 40.00, '2026-05-23 21:01:57'),
(9, 1, 9, 36.00, '2026-05-23 21:30:51'),
(10, 1, 10, 4936.00, '2026-05-23 21:31:07'),
(11, 1, 11, 1400.00, '2026-05-23 21:31:35'),
(12, 1, 12, 200.00, '2026-05-23 21:31:52'),
(13, 1, 13, 1299.00, '2026-05-23 21:32:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registros_reciclaje`
--

CREATE TABLE `registros_reciclaje` (
  `id_registro` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `puntos_generados` decimal(10,2) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registros_reciclaje`
--

INSERT INTO `registros_reciclaje` (`id_registro`, `id_usuario`, `id_categoria`, `cantidad`, `puntos_generados`, `fecha_registro`) VALUES
(1, 1, 1, 5, 10.00, '2026-05-22 06:55:39'),
(2, 1, 5, 20, 20.00, '2026-05-22 06:56:38'),
(3, 1, 1, 10, 20.00, '2026-05-23 20:17:44'),
(4, 1, 2, 13, 19.50, '2026-05-23 20:18:07'),
(5, 1, 3, 1234, 3702.00, '2026-05-23 20:45:21'),
(6, 1, 1, 300, 600.00, '2026-05-23 20:55:55'),
(7, 1, 3, 300, 900.00, '2026-05-23 21:00:24'),
(8, 1, 1, 20, 40.00, '2026-05-23 21:01:57'),
(9, 1, 3, 12, 36.00, '2026-05-23 21:30:51'),
(10, 1, 4, 1234, 4936.00, '2026-05-23 21:31:07'),
(11, 1, 1, 700, 1400.00, '2026-05-23 21:31:35'),
(12, 1, 1, 100, 200.00, '2026-05-23 21:31:52'),
(13, 1, 3, 433, 1299.00, '2026-05-23 21:32:34');

--
-- Disparadores `registros_reciclaje`
--
DELIMITER $$
CREATE TRIGGER `calcular_puntos` BEFORE INSERT ON `registros_reciclaje` FOR EACH ROW BEGIN
    DECLARE puntos_categoria DECIMAL(10,2);

    SELECT puntos_por_unidad
    INTO puntos_categoria
    FROM categorias
    WHERE id_categoria = NEW.id_categoria;

    SET NEW.puntos_generados = NEW.cantidad * puntos_categoria;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `insertar_historial_puntos` AFTER INSERT ON `registros_reciclaje` FOR EACH ROW BEGIN
    INSERT INTO puntos (id_usuario, id_registro, puntos)
    VALUES (NEW.id_usuario, NEW.id_registro, NEW.puntos_generados);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre_completo` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo`, `contrasena`, `fecha_creacion`) VALUES
(1, 'Samuel Olaya Paramo', 'olayasamuel17@gmail.com', '$2a$10$43A5ij8U2lyP2lbTF5T7ZukSAsVvzHYpgi7U792QAPwKsKUD8juJq', '2026-05-02 18:55:10'),
(2, 'Juan Camilo Vargas', 'juancamilovargasjimenez676@gmail.com', '$2a$10$wC.za5tWWwQUnX9Ih/oM8.HMzsrPbSiLaekTIsPWFJvH2MlHJoL22', '2026-05-22 05:10:55');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `canjes`
--
ALTER TABLE `canjes`
  ADD PRIMARY KEY (`id_canje`),
  ADD KEY `idx_usuario_canjes` (`id_usuario`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `puntos`
--
ALTER TABLE `puntos`
  ADD PRIMARY KEY (`id_punto`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_registro` (`id_registro`);

--
-- Indices de la tabla `registros_reciclaje`
--
ALTER TABLE `registros_reciclaje`
  ADD PRIMARY KEY (`id_registro`),
  ADD KEY `id_categoria` (`id_categoria`),
  ADD KEY `idx_usuario` (`id_usuario`),
  ADD KEY `idx_fecha` (`fecha_registro`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `canjes`
--
ALTER TABLE `canjes`
  MODIFY `id_canje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `puntos`
--
ALTER TABLE `puntos`
  MODIFY `id_punto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `registros_reciclaje`
--
ALTER TABLE `registros_reciclaje`
  MODIFY `id_registro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `canjes`
--
ALTER TABLE `canjes`
  ADD CONSTRAINT `canjes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `puntos`
--
ALTER TABLE `puntos`
  ADD CONSTRAINT `puntos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `puntos_ibfk_2` FOREIGN KEY (`id_registro`) REFERENCES `registros_reciclaje` (`id_registro`);

--
-- Filtros para la tabla `registros_reciclaje`
--
ALTER TABLE `registros_reciclaje`
  ADD CONSTRAINT `registros_reciclaje_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `registros_reciclaje_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
