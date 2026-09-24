```powershell
docker compose build
docker tag weather-pulse-frontend:latest kelyankeke/weather-pulse-frontend:latest
docker tag weather-pulse-backend:latest kelyankeke/weather-pulse-backend:latest
docker push kelyankeke/weather-pulse-frontend:latest
docker push kelyankeke/weather-pulse-backend:latest
kubectl apply -f k8s/weather-pulse.yaml
kubectl get pods
kubectl get services
```
