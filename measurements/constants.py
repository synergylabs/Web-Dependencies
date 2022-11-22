from enum import Enum

class Ns_type(Enum):
    Unknown = "Unknown"
    Private = "Private"
    Third_Party = "Third Party"

class Node_type(Enum):
    Client = "Client"
    Provider = "Provider"