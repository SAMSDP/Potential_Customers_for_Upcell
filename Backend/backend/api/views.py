from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def task_list(request):
    tasks = [
        {"id": 1, "task": "Learn Vite + Django"},
        {"id": 2, "task": "Build Fullstack App"}
    ]
    return Response(tasks)
