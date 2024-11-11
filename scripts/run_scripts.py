import subprocess
import sys
import logging

logging.basicConfig(filename='/var/log/cron_python.log', level=logging.DEBUG)

def run_script(script_name):
    result = subprocess.run([sys.executable, script_name], capture_output=True, text=True)
    
    if result.returncode == 0:
        logging.info(f"{script_name} completed successfully.\nOutput:\n{result.stdout}")
    else:
        logging.error(f"Error occurred while running {script_name}.\nError:\n{result.stderr}")
        return False

    return True



def main():
    scripts = ["get_raw_headlines.py", "generate_headline_summaries.py", "send_emails.py"]

    for script in scripts:
        logging.info(f"Running: {script}")
        if not run_script(script):
            logging.error("Stopping further execution due to error.")
            break


if __name__ == "__main__":
    main()