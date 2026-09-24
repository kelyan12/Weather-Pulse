```powershell
docker compose build
docker tag weather-pulse-frontend:latest kelyan12/weather-pulse-frontend:latest
docker tag weather-pulse-backend:latest kelyan12/weather-pulse-backend:latest
docker push kelyan12/weather-pulse-frontend:latest
docker push kelyan12/weather-pulse-backend:latest
kubectl apply -f k8s/weather-pulse.yaml
kubectl get pods
kubectl get services
```