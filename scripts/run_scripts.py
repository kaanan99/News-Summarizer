import subprocess


def run_script(script_name):
    result = subprocess.run(['python', script_name], capture_output=True, text=True)
    
    if result.returncode == 0:
        print(f"{script_name} completed successfully.\nOutput:\n{result.stdout}")
    else:
        print(f"Error occurred while running {script_name}.\nError:\n{result.stderr}")
        return False

    return True



def main():
    scripts = ["get_raw_headlines.py", "generate_headline_summaries.py", "send_emails.py"]

    for script in scripts:
        if not run_script(script):
            print("Stopping further execution due to error.")
            break


if __name__ == "__main__":
    main()