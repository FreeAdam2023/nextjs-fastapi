"""
@Time ： 2024-11-08
@Auth ： Adam Lyu
"""

# api/tests/test_main.py
from fastapi.testclient import TestClient
from ..index import app  # 根据你的 FastAPI 应用文件路径调整

client = TestClient(app)


def test_healthchecker():
    response = client.get("/api/healthchecker")
    assert response.status_code == 200
    assert response.json() == {
        "status": "success",
        "message": "Integrate FastAPI Framework with Next.js"
    }


def test_create_todo():
    response = client.post("/api/todos", json={"title": "Test Todo"})
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["completed"] is False  # 使用 "is False" 符合 E712 要求


def test_get_all_todos():
    response = client.get("/api/todos")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_todo():
    response = client.post("/api/todos", json={"title": "Sample Todo"})
    todo_id = response.json()["id"]
    response = client.get(f"/api/todos/{todo_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Sample Todo"


def test_update_todo():
    response = client.post("/api/todos", json={"title": "Todo to Update"})
    todo_id = response.json()["id"]
    response = client.patch(f"/api/todos/{todo_id}", json={"completed": True})
    assert response.status_code == 200
    assert response.json()["completed"] is True  # 使用 "is True" 符合 E712 要求


def test_delete_todo():
    response = client.post("/api/todos", json={"title": "Todo to Delete"})
    todo_id = response.json()["id"]
    response = client.delete(f"/api/todos/{todo_id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Todo item deleted"}
