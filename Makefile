.PHONY: help start stop restart logs status build clean seed shell-backend shell-frontend shell-db

# Colores para el output
BLUE=\033[0;34m
GREEN=\033[0;32m
RED=\033[0;31m
YELLOW=\033[1;33m
NC=\033[0m # No Color

help: ## Mostrar esta ayuda
	@echo "$(BLUE)🌙 Moon TV - Comandos Docker$(NC)"
	@echo "================================"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

start: ## Iniciar todos los servicios
	@echo "$(BLUE)🚀 Iniciando Moon TV...$(NC)"
	@docker-compose up -d
	@sleep 5
	@make status
	@echo "$(GREEN)✅ Aplicación disponible en http://localhost:3000$(NC)"

stop: ## Detener todos los servicios
	@echo "$(YELLOW)⏸️  Deteniendo Moon TV...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✅ Detenido$(NC)"

restart: ## Reiniciar todos los servicios
	@echo "$(BLUE)🔄 Reiniciando servicios...$(NC)"
	@docker-compose restart
	@echo "$(GREEN)✅ Reiniciado$(NC)"

logs: ## Ver logs de todos los servicios
	@docker-compose logs -f

logs-backend: ## Ver logs del backend
	@docker-compose logs -f backend

logs-frontend: ## Ver logs del frontend
	@docker-compose logs -f frontend

logs-db: ## Ver logs de MongoDB
	@docker-compose logs -f mongodb

status: ## Ver estado de los contenedores
	@echo "$(BLUE)📊 Estado de los contenedores:$(NC)"
	@docker-compose ps

build: ## Construir las imágenes
	@echo "$(BLUE)🔨 Construyendo imágenes...$(NC)"
	@docker-compose build
	@echo "$(GREEN)✅ Imágenes construidas$(NC)"

rebuild: ## Reconstruir e iniciar
	@echo "$(BLUE)🔨 Reconstruyendo Moon TV...$(NC)"
	@docker-compose up -d --build
	@sleep 5
	@make status

clean: ## Limpiar contenedores y volúmenes (¡PRECAUCIÓN!)
	@echo "$(RED)⚠️  PRECAUCIÓN: Esto eliminará todos los datos$(NC)"
	@read -p "¿Estás seguro? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(RED)🗑️  Eliminando contenedores y volúmenes...$(NC)"; \
		docker-compose down -v --rmi all; \
		echo "$(GREEN)✅ Limpieza completada$(NC)"; \
	else \
		echo "$(YELLOW)❌ Cancelado$(NC)"; \
	fi

seed: ## Importar canales desde M3U
	@echo "$(BLUE)📺 Importando canales...$(NC)"
	@echo "$(YELLOW)⚠️  Asegúrate de haber editado: backend/scripts/channels.m3u$(NC)"
	@docker-compose exec backend npm run seed

seed-large: ## Importar archivo M3U grande (mejorado)
	@echo "$(BLUE)📺 Importando archivo M3U grande...$(NC)"
	@docker-compose exec backend node scripts/seedChannelsLarge.js

import: ## Importar archivo M3U del directorio actual
	@./import-large.sh

shell-backend: ## Abrir shell en el contenedor del backend
	@echo "$(BLUE)🐚 Abriendo shell en backend...$(NC)"
	@docker-compose exec backend sh

shell-frontend: ## Abrir shell en el contenedor del frontend
	@echo "$(BLUE)🐚 Abriendo shell en frontend...$(NC)"
	@docker-compose exec frontend sh

shell-db: ## Abrir MongoDB shell
	@echo "$(BLUE)🐚 Abriendo MongoDB shell...$(NC)"
	@docker-compose exec mongodb mongosh moontv

install: ## Instalación completa desde cero
	@echo "$(BLUE)📦 Instalación de Moon TV...$(NC)"
	@make build
	@make start
	@echo ""
	@echo "$(GREEN)✅ Instalación completada!$(NC)"
	@echo "$(BLUE)🌐 Aplicación: http://localhost:3000$(NC)"
	@echo "$(BLUE)🔧 API: http://localhost:5000$(NC)"
	@echo ""
	@echo "Para importar canales, ejecuta: $(YELLOW)make seed$(NC)"

dev: ## Iniciar en modo desarrollo con logs
	@docker-compose up

health: ## Verificar salud de los servicios
	@echo "$(BLUE)🏥 Verificando servicios...$(NC)"
	@echo ""
	@echo "Backend (http://localhost:5000):"
	@curl -s http://localhost:5000 > /dev/null && echo "$(GREEN)✅ OK$(NC)" || echo "$(RED)❌ ERROR$(NC)"
	@echo ""
	@echo "Frontend (http://localhost:3000):"
	@curl -s http://localhost:3000 > /dev/null && echo "$(GREEN)✅ OK$(NC)" || echo "$(RED)❌ ERROR$(NC)"
	@echo ""
