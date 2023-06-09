import os.path


def check_and_create_country_month_dir(country, month):
    # Create country path and country month path if necessary
    country_path = f'./files/countries/{country}'
    country_month_path = f'./files/countries/{country}/{month}'
    if not os.path.exists(country_path):
        os.mkdir(country_path)
        os.mkdir(country_month_path)
    elif not os.path.exists(country_month_path):
        os.mkdir(country_month_path)


def write_file_content(file_content, file_path):
    f = open(file_path, 'w')
    f.write(file_content)
    f.close()
