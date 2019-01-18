#!/bin/bash
# Script to automate Heroku Prototype setup

echo Please enter the version of the Prototype:
read version_number

# Heroku App creation and Configuration:
heroku apps:create probate-prototype-v$version_number --region eu

# Create username for the prototype
echo Please enter the username you would like to use:
read user_name
heroku config:set USERNAME=$user_name --app probate-prototype-v$version_number

# Create password for the prototype
echo Please enter the password you would like to use:
read password
heroku config:set PASSWORD=$password --app probate-prototype-v$version_number

# Add new app to list of git remote repositories
git remote add probate-prototype-v$version_number git@heroku.com:probate-prototype-v$version_number.git
heroku git:remote -a probate-prototype-v$version_number -r probate-prototype-v$version_number

# Push to main application and new Version of Prototype
git push heroku master && git push probate-prototype-v$version_number master


##############################################################
########################### NOTES ############################
##############################################################

# Below is a useful reference for common commands.

# - Create Heroku app:
# heroku create <app_name>

# - Alternate approach as suggested by .gov:
# heroku apps:create <app_name> --region eu

# - Setup username and password for app:
# heroku config:set USERNAME=username_here --app <app_name>
# heroku config:set PASSWORD=password_here --app <app_name>

# - Link git repository to app (ensure you are in the git repo directory):
# heroku git:remote -a <app_name>

# - To push to new app or any other app:
# git push <app_name> master

# - To view list of git remotes:
# git remote -v

# - By default Heroku names all remotes it creates HEROKU.
# - To rename just use the following command.
# - The aim is to always keep only the main prototype using the namespace HEROKU, and all other apps using prototype-vX.
# git remote rename <remote_name> <new_remote_name>

# - If you wish to push to both main prototype and new version, you can chain commands (you can chain as many as required):
# git push heroku master && git push <app_name> master

# - To view the logs for the app:
# heroku logs -a <app_name>
# - To view only the last few lines of the logs:
# heroku logs -t -a <app_name>

# - If you ever need any further information just use:
# heroku --help

##############################################################
##############################################################
##############################################################