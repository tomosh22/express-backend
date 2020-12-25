#Express backend

### Set up

* Clone *Express app* from nucode.
* Run *Docker* on your machine and run command `docker run -p=33333:3306 --name Stubank stubank --default-authentication-plugin=mysql_native_password` being inside */database* directory.
* Go to the **"Edit Run/Debug configurations dialog"** on the top right of the IntelliJ and run `bin/www`.

---


This express application will handle the HTTP requests
necessary for our react application to interact with our
database running in docker

The docker db must be running on port 33333 and must
be started with the argument
--default-authentication-plugin=mysql_native_password

To test a HTTP GET go to http://localhost:3000/selectLoginUser/bobg
in a browser

To test a HTTP post execute this command in the command line:

curl --data '' post http://localhost:3000/insertAddressQuery/line1test/line2/test/postcodetest
