# Settings
This repository contains no settings file.

# Run the development server
For running the development server, the settings module must be specified.
	DJANGO_SETTINGS_MODULE="book.settings_production" python3 manage.py runserver

# Database requirements
The search function uses trigram similarity. Thus it has to be activated on the database.
	CREATE EXTENSION pg_trgm;
