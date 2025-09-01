# prediction/services.py

import subprocess
import sys
import json
import uuid
from pathlib import Path
from threading import Thread
from collections import defaultdict

# --- Scripts directory (main_pipeline.py is here) ---
BASE_DIR = Path(__file__).resolve().parent.parent  # this is Backend/
SCRIPTS_DIR = BASE_DIR.parent / "Scripts"          # go one level up, then into Scripts


# --- In-memory storage for signals and results ---
JOB_SIGNALS = defaultdict(list)  # Stores signals for each job_id
JOB_RESULTS = {}                 # Stores final result for each job_id


# --- Generate unique job ID ---
def generate_job_id():
    return str(uuid.uuid4())


# --- Run main_pipeline.py as a subprocess ---
def run_pipeline(file_path, job_id):
    """
    Executes main_pipeline.py with the given file_path.
    Signals (start/done) are collected in JOB_SIGNALS[job_id].
    Final JSON result is stored in JOB_RESULTS[job_id].
    """
    JOB_SIGNALS[job_id] = []

    def target():
        try:
            print(f"[DEBUG] Starting pipeline for job_id={job_id}, file_path={file_path}")
            process = subprocess.Popen(
                [sys.executable, str(SCRIPTS_DIR / "main_pipeline.py"), "--file", str(file_path)],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=1  # line buffered
            )


            final_result = None

            # --- Read stdout line by line ---
            for line in iter(process.stdout.readline, ""):
                line = line.strip()
                if not line:
                    continue
                print(f"[STDOUT] {line}")  # debug log

                try:
                    msg = json.loads(line)

                    # Collect signals
                    if msg.get("type") == "signal":
                        JOB_SIGNALS[job_id].append(msg)
                        print(f"[DEBUG] Signal captured: {msg}")

                    # Collect final result
                    elif msg.get("status") in ("success", "error"):
                        final_result = msg
                        print(f"[DEBUG] Final result captured: {msg}")

                except json.JSONDecodeError:
                    print(f"[DEBUG] Could not parse line as JSON: {line}")
                except Exception as e:
                    print(f"[DEBUG] Unexpected error while parsing line: {e}")

            # --- Read stderr (errors from script) ---
            stderr_output = process.stderr.read()
            if stderr_output:
                print(f"[STDERR] {stderr_output}")

            process.stdout.close()
            process.stderr.close()
            process.wait()

            # Save final result if found, else fallback error
            if final_result:
                JOB_RESULTS[job_id] = final_result
            else:
                JOB_RESULTS[job_id] = {"status": "error", "message": "No final result produced"}
                print(f"[DEBUG] No final result produced for job_id={job_id}")

        except Exception as e:
            JOB_RESULTS[job_id] = {"status": "error", "message": str(e)}
            print(f"[DEBUG] Exception in pipeline thread: {e}")

    # Start pipeline in background thread
    thread = Thread(target=target, daemon=True)
    thread.start()

    return job_id


# --- Retrieve live signals for a job ---
def get_job_signals(job_id):
    """
    Returns all signals for a given job_id.
    """
    return JOB_SIGNALS.get(job_id, [])


# --- Retrieve final JSON result for a job ---
def get_job_result(job_id):
    """
    Returns final pipeline JSON result for a given job_id.
    """
    return JOB_RESULTS.get(job_id)
