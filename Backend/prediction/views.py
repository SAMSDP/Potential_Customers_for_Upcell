from rest_framework.renderers import JSONRenderer
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.response import Response
from rest_framework import status
from .services import run_pipeline, get_job_signals, get_job_result, generate_job_id

# --- Upload endpoint: receive file and start pipeline ---
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def upload_file(request):
    """
    Expects a file in request.FILES['file']
    Returns: job_id
    """
    uploaded_file = request.FILES.get('file')  # must match the form-data key
    if not uploaded_file:
        return Response({"error": "No file provided"}, status=400)

    # Save the uploaded file temporarily
    import tempfile, os
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, uploaded_file.name)
    with open(file_path, 'wb+') as f:
        for chunk in uploaded_file.chunks():
            f.write(chunk)

    # Generate unique job_id
    job_id = generate_job_id()

    # Start the pipeline asynchronously
    run_pipeline(file_path, job_id)

    return Response({"job_id": job_id}, status=status.HTTP_200_OK)


# --- Polling endpoint: get current signals for a job ---
@api_view(['GET'])
def model_status(request, job_id):
    """
    Returns list of signal JSONs for the given job_id
    """
    signals = get_job_signals(job_id)
    return Response({"job_id": job_id, "signals": signals}, status=status.HTTP_200_OK)


# --- Final result endpoint: get pipeline output for a job ---
@api_view(['GET'])
def pipeline_result(request, job_id):
    """
    Returns final JSON result after pipeline completion
    """
    result = get_job_result(job_id)
    if not result:
        return Response({"error": "Result not ready"}, status=status.HTTP_202_ACCEPTED)
    return Response(result, status=status.HTTP_200_OK)
