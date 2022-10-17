import socket
import ssl
import subprocess
import tldextract
import config

def run_subprocess(command: list) -> str:
    """Run subprocess with the input command"""
    output = ''
    try:
        output = subprocess.check_output(command)
        output = str(output, 'utf-8')
    except subprocess.CalledProcessError as e:
        config.output_file.write(e.output)

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
        config.output_file.write(addr[0] + ":ssl-certificate-error" + str(e) + "\n")
    except socket.error as e:
        config.output_file.write(addr[0] + ":socket-error" + str(e) + "\n")
    
    return cert

def log_output(message: str):
    config.output_file.write(message)