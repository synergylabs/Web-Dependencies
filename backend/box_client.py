from utils import get_last_month
from boxsdk import Client
from boxsdk.auth.ccg_auth import CCGAuth

CLIENT_ID = "s3e4dg4x9o33dd46hek5gfjogd40nlni"
CLIENT_SECRET = "xxx"
ROOT_FOLDER_ID = "182556826473"
ENTERPRISE_ID = "81467"

auth = CCGAuth(
  client_id=CLIENT_ID,
  client_secret=CLIENT_SECRET,
  enterprise_id=ENTERPRISE_ID,
)
client = Client(auth)

folder_name = f'data-{get_last_month()}'

# Create target folder
folder = client.folder(ROOT_FOLDER_ID).create_subfolder("test folder2")
print(f'Created folder with Name {folder.name} and ID {folder.id}')

# Upload File
test_file_name = 'top-1m.csv'
# Minimum file size for chunk upload: 20000000
chunked_uploader = client.folder(folder.id).get_chunked_uploader(
    file_path=f'./{test_file_name}', file_name=test_file_name
)
uploaded_file = chunked_uploader.start()
print(f'File "{uploaded_file.name}" uploaded to Box with file ID {uploaded_file.id}')


# Download File
file_id = uploaded_file.id

# Write the Box file contents to disk
output_file = open('download_file', 'wb')
client.file(file_id).download_to(output_file)
