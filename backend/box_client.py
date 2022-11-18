from utils import get_last_month
from boxsdk import OAuth2, Client
from boxsdk.auth.ccg_auth import CCGAuth

CLIENT_ID = "cbuanhhx2m61mr8p0tastd771vu01r4g"
CLIENT_SECRET = "xxx"
DEV_TOKEN = "xxx"
ROOT_FOLDER_ID = "182556826473"

auth = OAuth2(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    access_token=DEV_TOKEN,
)
client = Client(auth)

folder_name = f'data-{get_last_month()}'

# Create target folder
folder = client.folder(ROOT_FOLDER_ID).create_subfolder(folder_name)
print(f'Created folder with Name {folder.name} and ID {folder.id}')

# Minimum file size for chunk upload: 20000000
chunked_uploader = client.folder(folder.id).get_chunked_uploader(
    file_path='./crux/crux-202210', file_name='crux-202210'
)
uploaded_file = chunked_uploader.start()
print(f'File "{uploaded_file.name}" uploaded to Box with file ID {uploaded_file.id}')
