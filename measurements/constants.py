from enum import Enum


class Ns_type(Enum):
    Unknown = "unknown"
    Private = "Pvt"
    Third = "Third"


class Node_type(Enum):
    Client = "Client"
    Provider = "Provider"


class Stats_type(Enum):
    Third_Only = "third_only"
    Critical = "critical"
    Redundant = "redundant"
    Private_And_Third = "private_and_third"
    Concentration = "concentration"
    Impact = "impact"
