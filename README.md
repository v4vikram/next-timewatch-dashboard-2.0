(https://timewatch-dashboard-fd-311005204045.europe-west1.run.app/)

<!-- Deploy -->
| The command gcloud container images list is used to list all container images within a specific repository in Google Cloud's Container Registry or Artifact Registry.
- gcloud container images list --repository=gcr.io/backend-469007

| The gcloud container images command lists the tags and their associated digests for the specified container image within Google Container Registry (GCR).
- gcloud container images list-tags gcr.io/backend-469007/dashboard-app

| build image
- docker build -t gcr.io/backend-469007/dashboard-app .

| push image
- docker push gcr.io/backend-469007/dashboard-app

| Deploy without authentication flag (so no OAuth lookup is triggered):

- gcloud run deploy dashboardy-app `
  --image=gcr.io/backend-dashboard-469008/dashboard-app `
  --platform=managed `
  --region=us-central1

| Then make it public manually with IAM policy:
- gcloud run services add-iam-policy-binding dashboardy-app `
  --member="allUsers" `
  --role="roles/run.invoker" `
  --region=us-central1 `
  --platform=managed

| Run this to list services in all regions:
- gcloud run services list --platform=managed

| fint deployed url
 - gcloud run services describe dashboardy-app --region us-central1 --format "value(status.url)"


| for deploy
- gcloud run deploy dashboardy-app --region us-central1 --source . --allow-unauthenticated --project backend-469007 --platform managed --quiet



| set project
- gcloud config set project second-height-468706-s4

| check project is active?
- gcloud config get-value project

| check services
- gcloud run services list --region=europe-west1





