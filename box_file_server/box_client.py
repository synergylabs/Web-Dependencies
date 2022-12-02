import json
from boxsdk import Client
from boxsdk.auth.ccg_auth import CCGAuth
from pathlib import Path


class BoxClient:
    def __init__(self):
        self.client_id = "s3e4dg4x9o33dd46hek5gfjogd40nlni"
        self.root_folder_id = "182556826473"
        self.enterprise_id = "81467"
        self.client = None

        self.init_client()

    def init_client(self):
        credentials_file = open(f"{Path.home()}/.secrets/credentials.json")
        data = json.load(credentials_file)
        auth = CCGAuth(
            client_id=self.client_id,
            client_secret=data["box_client"],
            enterprise_id=self.enterprise_id,
        )
        self.client = Client(auth)

    def get_file(self, country, service, month):
        folder_name = f'data-{month}'
        file_name = f'{country}-{service}-{month}'
        file_id = None
        file_content = ""

        subfolders = self.client.folder(
            folder_id=self.root_folder_id).get_items()
        for subfolder in subfolders:
            if subfolder.name == folder_name:
                files = self.client.folder(folder_id=subfolder.id).get_items()
                for file in files:
                    if file.name == file_name:
                        file_id = file.id
        if file_id:
            # Write the Box file contents to disk
            file_content = self.client.file(file_id).content()
        return file_content

        # Write the Box file contents to disk
        # output_file = open('download_file', 'wb')
        # client.file(file_id).download_to(output_file)


box_client = BoxClient()
