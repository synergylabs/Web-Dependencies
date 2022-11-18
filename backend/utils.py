import socket
import ssl
import subprocess
import datetime
import tldextract
import config
from io import TextIOWrapper


def run_subprocess(command: list) -> str:
    """Run subprocess with the input command"""
    output = ''
    try:
        output = subprocess.check_output(command)
        output = str(output, 'utf-8')
    except subprocess.CalledProcessError as e:
        log_error(str(e.output))

    return output

def get_sld_tld(website: str) -> str:
    """Extract second level domain and first level domain

    Args:
        website (str): full website url

    Returns:
        str: "sld.tld"
    """
    tld = tldextract.extract(website)
    domain = f"{tld.domain}.{tld.suffix}"

    return domain

def get_cert(addr, timeout=None) -> dict:
    """Retrieve server's certificate at the specified address (host, port)."""
    # it is similar to ssl.get_server_certificate() but it returns a dict
    # and it verifies ssl unconditionally, assuming create_default_context does
    cert = {}
    try:
        sock = socket.create_connection(addr, timeout=timeout)
        context = ssl.create_default_context()
        sslsock = context.wrap_socket(sock, server_hostname=addr[0])
        cert = sslsock.getpeercert()
    except ssl.CertificateError as e:  
        log_error(f'{addr[0]}:ssl-certificate-error{str(e)}\n')         
    except socket.error as e:
        log_error(f'{addr[0]}:socket-error{str(e)}\n')  
    
    return cert

def get_last_month():
    today = datetime.date.today()
    first = today.replace(day=1)
    last_month = first - datetime.timedelta(days=1)
    return last_month.strftime("%Y%m")

def build_node_and_type(label: str, node_type: str):
    return f'{label}:{node_type}'

def log_measurement_result(message: str):
    log_result(config.measurment_result_file, message)

def log_classify_result(message: str):
    log_result(config.classify_result_file, message)

def log_group_result(message: str):
    log_result(config.group_result_file, message)

def log_graph_result(message: str):
    log_result(config.graph_result_file, message)

def log_error(message: str):
    log_result(config.error_file, message)

def log_result(result_file: TextIOWrapper, message: str):
    result_file.write(message)