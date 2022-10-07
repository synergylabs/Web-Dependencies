import subprocess

def run_subprocess(command: list) -> str:
    try:
        output = subprocess.check_output(command)
        output = str(output, 'utf-8')
    except subprocess.CalledProcessError as e:
            print(e.output)
            pass
    
    return output