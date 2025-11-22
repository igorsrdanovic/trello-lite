.PHONY: help build build-dev up up-dev down down-dev logs logs-dev clean rebuild

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m # No Color

help: ## Show this help message
	@echo '$(BLUE)Trello Lite - Docker Commands$(NC)'
	@echo ''
	@echo '$(YELLOW)Usage:$(NC)'
	@echo '  make $(GREEN)<target>$(NC)'
	@echo ''
	@echo '$(YELLOW)Targets:$(NC)'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build production Docker image
	@echo '$(BLUE)Building production image...$(NC)'
	docker-compose build

build-dev: ## Build development Docker image
	@echo '$(BLUE)Building development image...$(NC)'
	docker-compose -f docker-compose.dev.yml build

up: ## Start production container
	@echo '$(GREEN)Starting production container...$(NC)'
	docker-compose up -d
	@echo '$(GREEN)Application running at http://localhost$(NC)'

up-dev: ## Start development container with hot-reload
	@echo '$(GREEN)Starting development container...$(NC)'
	docker-compose -f docker-compose.dev.yml up -d
	@echo '$(GREEN)Development server running at http://localhost:5173$(NC)'

down: ## Stop production container
	@echo '$(YELLOW)Stopping production container...$(NC)'
	docker-compose down

down-dev: ## Stop development container
	@echo '$(YELLOW)Stopping development container...$(NC)'
	docker-compose -f docker-compose.dev.yml down

logs: ## View production container logs
	docker-compose logs -f

logs-dev: ## View development container logs
	docker-compose -f docker-compose.dev.yml logs -f

shell: ## Open shell in production container
	docker-compose exec trello-lite sh

shell-dev: ## Open shell in development container
	docker-compose -f docker-compose.dev.yml exec trello-lite-dev sh

clean: ## Remove containers and images
	@echo '$(YELLOW)Cleaning up...$(NC)'
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.dev.yml down -v --rmi all

rebuild: ## Rebuild and restart production container
	@echo '$(BLUE)Rebuilding production container...$(NC)'
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d
	@echo '$(GREEN)Application running at http://localhost$(NC)'

rebuild-dev: ## Rebuild and restart development container
	@echo '$(BLUE)Rebuilding development container...$(NC)'
	docker-compose -f docker-compose.dev.yml down
	docker-compose -f docker-compose.dev.yml build --no-cache
	docker-compose -f docker-compose.dev.yml up -d
	@echo '$(GREEN)Development server running at http://localhost:5173$(NC)'

ps: ## Show running containers
	docker-compose ps

ps-dev: ## Show running development containers
	docker-compose -f docker-compose.dev.yml ps

health: ## Check container health
	@docker inspect --format='{{.State.Health.Status}}' trello-lite-prod 2>/dev/null || echo "Container not running"
