#Express backend

This express application will handle the HTTP requests
necessary for our react application to interact with our
database running in docker

The docker db must be running on port 33333 and must
be started with the argument
--default-authentication-plugin=mysql_native_password

To test a HTTP GET go to http://localhost:3000/selectLoginUser/bobg
in a browser

To test a HTTP post execute this command in the command line:

curl -X post http://localhost:3000/insertAddressQuery/1/sdfvb/sdv/dsfv/dsfv