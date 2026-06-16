def test_login_success(client):
    response = client.post("/auth/login", json={
        "username": "admin",
        "password": "testpass123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_wrong_password(client):
    response = client.post("/auth/login", json={
        "username": "admin",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_login_wrong_username(client):
    response = client.post("/auth/login", json={
        "username": "hacker",
        "password": "testpass123"
    })
    assert response.status_code == 401

def test_logout(client):
    login = client.post("/auth/login", json={
        "username": "admin",
        "password": "testpass123"
    })
    assert login.status_code == 200
    response = client.post("/auth/logout")
    assert response.status_code == 200

def test_refresh_without_cookie(client):
    response = client.post("/auth/refresh")
    assert response.status_code == 401
