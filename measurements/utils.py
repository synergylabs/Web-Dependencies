import socket
import ssl
import subprocess
import datetime
import tldextract
import config
import socket
from io import TextIOWrapper


def isIP(ip):
    try:
        socket.inet_aton(ip)
        return True
    except socket.error:
        return False


def read_san_lib(san_lib_file: str) -> list:
    domain_san = []
    f = open(san_lib_file, "r")
    for line in f:
        line = line.strip().lower()
        details = line.split(",")
        domain_san.append(details)

        # domain_soa[domain] = (details[1].lower(),details[2].lower())
    return domain_san


def read_soa_lib(soa_lib_file: str) -> dict:
    domain_soa = {}
    f = open(soa_lib_file, "r")
    for line in f:
        # print(line)
        line = line.strip()
        details = line.split(",")
        domain = details[0].lower()
        domain_soa[domain] = (details[1].lower(), details[2].lower())
    return domain_soa


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
    except ssl.CertificateError as cert_error:
        log_error(f'{addr[0]}:ssl-certificate-error{str(cert_error)}\n')
    except socket.error as socket_error:
        log_error(f'{addr[0]}:socket-error{str(socket_error)}\n')

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


def log_ip_result(message: str):
    log_result(config.ip_result_file, message)


def log_ns_result(message: str):
    log_result(config.ns_result_file, message)


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
