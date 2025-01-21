from locust import HttpUser, task, between

class UserBehavior(HttpUser):
    wait_time = between(1, 3)

    @task
    def get_users(self):
        self.client.get("/api/users")

    @task
    def create_user(self):
        self.client.post("/api/users", json={"name": "Test User", "email": "test@example.com"})
