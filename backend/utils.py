import socket
import ssl
import subprocess
import tldextract

def run_subprocess(command: list) -> str:
    output = ''
    try:
        output = subprocess.check_output(command)
        output = str(output, 'utf-8')
    except subprocess.CalledProcessError as e:
            print(e.output)
            pass
    
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

def get_cert(addr, timeout=None):
    """Retrieve server's certificate at the specified address (host, port)."""
    # it is similar to ssl.get_server_certificate() but it returns a dict
    # and it verifies ssl unconditionally, assuming create_default_context does
    sock = socket.create_connection(addr, timeout=timeout)

    context = ssl.create_default_context()
    sslsock = context.wrap_socket(sock, server_hostname=addr[0])
    return sslsock.getpeercert()