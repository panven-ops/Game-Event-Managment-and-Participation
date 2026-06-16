def test_event_status_no_event(client):
    response = client.get("/event/status")
    assert response.status_code == 200
    assert response.json()["active"] is False
