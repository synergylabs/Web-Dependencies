import json
import os.path
from boxsdk import Client
from boxsdk.auth.ccg_auth import CCGAuth
from pathlib import Path
from helper import check_and_create_country_month_dir, write_file_content


class BoxClient:
    def __init__(self):
        self.client_id = "s3e4dg4x9o33dd46hek5gfjogd40nlni"
        self.root_folder_id = "182556826473"
        self.enterprise_id = "81467"
        self.client = None
        self.last_updated = None
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

    def get_file_list_from_box(self, country, service):
        file_name_prefix = f'{country}-{service}'
        output_files = []
        subfolders = self.client.folder(folder_id=self.root_folder_id).get_items()
        for subfolder in subfolders:
            if(subfolder.type == "folder"):
                files = self.client.folder(folder_id=subfolder.id).get_items()
                for file in files:
                    if file_name_prefix in file.name:
                        tag = subfolder.name.split("-")[1]
                        output_files.append(tag)
        print(output_files)
        return ";".join(output_files)
        
    def get_local_file_lists(self, country, service):
        dir_path = f"./files/countries/{country}/"
        entries = Path(dir_path)
        files = []
        for folder in entries.iterdir():
            print(folder)
            for file in folder.iterdir():
                if(service in file.stem):
                    files.append(folder.stem)
        return ";".join(files)
    
    def get_file_lists(self, country, service, month):
        if(self.last_updated != month):
            print(country, service, month)
            files = self.get_file_list_from_box(country, service)
            self.last_updated = month
        else:
            files = self.get_local_file_lists(country, service)
        
        return files
        
        

    def get_country_file(self, country, service, month):

        folder_name = f'data-{month}'
        file_name = f'{country}-{service}-{month}'
        file_content = ""

        file_path = f'./files/countries/{country}/{month}/{file_name}'

        if os.path.isfile(file_path):
            print('file exists')
            file = open(file_path, 'r')
            file_content = file.read()
            file.close()
        else:
            print('path is not file')
            check_and_create_country_month_dir(country, month)

            file_id = None
            subfolders = self.client.folder(folder_id=self.root_folder_id).get_items()
            for subfolder in subfolders:
                if subfolder.name == folder_name:
                    files = self.client.folder(folder_id=subfolder.id).get_items()
                    for file in files:
                        if file.name == file_name:
                            file_id = file.id
            if file_id:
                # Write the Box file contents to disk
                file_content = self.client.file(file_id).content()
                file_content = file_content.decode('utf-8')
                write_file_content(file_content, file_path)
        return file_content

    def get_graph_file(self, country, service, month):
        filename = f'{country}-{service}-{month}-graph.json'
        file_content = self.find_file(country, service, month, filename)

        return file_content

    def get_provider_stats(self, country, service, month):
        filename = f'{country}-{service}-{month}-provider-stats'
        file_content = self.find_file(country, service, month, filename)

        return file_content

    def get_client_stats(self, country, service, month):
        filename = f'{country}-{service}-{month}-client-stats'
        file_content = self.find_file(country, service, month, filename)

        return file_content

    def get_provider_stats(self, country, service, month):
        filename = f'{country}-{service}-{month}-provider-stats'
        file_content = self.find_file(country, service, month, filename)

        return file_content

    def get_client_stats(self, country, service, month):
        filename = f'{country}-{service}-{month}-client-stats'
        file_content = self.find_file(country, service, month, filename)

        return file_content

    def find_file(self, country, service, month, filename):
        file_id = None
        file_content = ""

        country_subfolders = self.client.folder(folder_id=self.root_folder_id).get_items()
        for cs in country_subfolders:
            if cs.name == country:
                month_subfolders = self.client.folder(folder_id=cs.id).get_items()
                for ms in month_subfolders:
                    if ms.name == month:
                        files = self.client.folder(folder_id=ms.id).get_items()
                        for file in files:
                            if file.name == filename:
                                file_id = file.id
        if file_id:
            # Write the Box file contents to disk
            file_content = self.client.file(file_id).content()

        return file_content


box_client = BoxClient()
