.PHONY: dev api web test build docker-up docker-down

dev:
	docker compose up --build

api:
	cd backend && uvicorn app.main:app --reload --port 8000

web:
	cd frontend && npm run dev

test:
	cd backend && pytest -q
	cd frontend && npm run typecheck

build:
	cd frontend && npm run build

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down
