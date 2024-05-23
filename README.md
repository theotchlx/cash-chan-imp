# cash-chan
  Cash-chan is a mobile-first single-page web app designed to assist management of team expenses and keep track of your own expenses in a early Internet -themed setting.  

## Technos:  
* Languages:  
  * JS, PHP, HTML, CSS  
* Libraries:  
  * Bootstrap (front-end framework)  
* Frameworks:  
  * None

---

### Deploying the app locally

This is an extract from the following Notion document, **part 6. Deploying the app**  
https://www.notion.so/Cash-chan-Technical-Documentation-56e94a389c4640e59890e66c0f4ad5e4

This part is more like a documentation on how to deploy the app locally, followed by an analysis of my tries at deploying the app in different ways.

This contents of this documentation were reproduced on Debian 12. (The machine was configured using this documentation: http://hal9000.facerias.org/sysadmin/sysadmin_4.pdf)

The following steps were carried out as system administrator (root user).

**Local deployment:**

1. First, we will install the latest version of PHP using the APT package manager.
    
    ```
    root@debian12-woa-deploy : ~
    # apt install php
    ...    
    Les paquets supplémentaires suivants seront installés : 
      apache2-bin libapache2-mod-php8.2 libapr1 libaprutil1 libaprutil1-dbd-sqlite3 libaprutil1-ldap php-common
      php8.2 php8.2-cli php8.2-common php8.2-opcache php8.2-readline psmisc
    Paquets suggérés :
      apache2-doc apache2-suexec-pristine | apache2-suexec-custom www-browser php-pear
    Paquets recommandés :
      apache2
    Les NOUVEAUX paquets suivants seront installés :
      apache2-bin libapache2-mod-php8.2 libapr1 libaprutil1 libaprutil1-dbd-sqlite3 libaprutil1-ldap php
      php-common php8.2 php8.2-cli php8.2-common php8.2-opcache php8.2-readline psmisc
    0 mis à jour, 14 nouvellement installés, 0 à enlever et 0 non mis à jour.
    Il est nécessaire de prendre 6 313 ko dans les archives.
    Après cette opération, 28,0 Mo d'espace disque supplémentaires seront utilisés.
    Souhaitez-vous continuer ? [O/n] yes
    ...
    
    root@debian12-woa-deploy : ~
    # apt list --installed |grep php
    
    libapache2-mod-php8.2/stable,stable-security,now 8.2.7-1~deb12u1 amd64  [installé, automatique]
    php-common/stable,now 2:93 all  [installé, automatique]
    php8.2-cli/stable,stable-security,now 8.2.7-1~deb12u1 amd64  [installé, automatique]
    php8.2-common/stable,stable-security,now 8.2.7-1~deb12u1 amd64  [installé, automatique]
    php8.2-opcache/stable,stable-security,now 8.2.7-1~deb12u1 amd64  [installé, automatique]
    php8.2-readline/stable,stable-security,now 8.2.7-1~deb12u1 amd64  [installé, automatique]
    php8.2/stable,stable-security,now 8.2.7-1~deb12u1 all  [installé, automatique]
    php/stable,now 2:8.2+93 all  [installé]
    ```
    
    PHP’s latest version was successfully installed.
    
    However, this is not enough. We also need to install the PostgreSQL extension for PHP:
    
    ```
    root@debian12-template : ~
    # apt install php-pgsql 
    ...   
    Les paquets supplémentaires suivants seront installés : 
      php8.2-pgsql
    Les NOUVEAUX paquets suivants seront installés :
      php-pgsql php8.2-pgsql
    0 mis à jour, 2 nouvellement installés, 0 à enlever et 0 non mis à jour.
    Il est nécessaire de prendre 61,2 ko dans les archives.
    Après cette opération, 236 ko d'espace disque supplémentaires seront utilisés.
    Souhaitez-vous continuer ? [O/n] yes
    ...
    ```
    
    Now, we have got all we need PHP wise.
    
2. Now we will install both the PostgreSQL server and client on the same machine.
    
    ```
    root@debian12-woa-deploy : ~
    # apt install postgresql
    ...  
    Les paquets supplémentaires suivants seront installés : 
      libjson-perl libllvm14 libpq5 libxslt1.1 libz3-4 postgresql-15 postgresql-client-15
      postgresql-client-common postgresql-common ssl-cert
    Paquets suggérés :
      postgresql-doc postgresql-doc-15
    Paquets recommandés :
      libjson-xs-perl
    Les NOUVEAUX paquets suivants seront installés :
      libjson-perl libllvm14 libpq5 libxslt1.1 libz3-4 postgresql postgresql-15 postgresql-client-15
      postgresql-client-common postgresql-common ssl-cert
    0 mis à jour, 11 nouvellement installés, 0 à enlever et 0 non mis à jour.
    Il est nécessaire de prendre 48,3 Mo dans les archives.
    Après cette opération, 198 Mo d'espace disque supplémentaires seront utilisés.
    Souhaitez-vous continuer ? [O/n] yes
    ...
    
    root@debian12-woa-deploy : ~
    # apt install postgresql-client
    ...
    Les NOUVEAUX paquets suivants seront installés :
      postgresql-client
    0 mis à jour, 1 nouvellement installés, 0 à enlever et 0 non mis à jour.
    Il est nécessaire de prendre 10,1 ko dans les archives.
    Après cette opération, 15,4 ko d'espace disque supplémentaires seront utilisés.
    ...
    ```
    
    We can now log in as the postgres user and connect to the default database.
    
    ```
    root@debian12-woa-deploy : ~
    # su - postgres 
    
    postgres@debian12-woa-deploy : ~
    $ psql
    psql (15.5 (Debian 15.5-0+deb12u1))
    Saisissez « help » pour l'aide.
    
    postgres=# \dt
    Aucune relation n'a été trouvée.
    postgres=#
    ```
    
    Here is the command I use to connect to a specific database with a specific database user:
    
    ```
    psql -U <db_user> -d <database> -h <IPv4_addr>
    ```
    
    Replace <db_user> by the user you may have created to manage your database, replace <database> by the name of that database, and replace <IPv4_addr> by the IP address that postgres is listening to on your machine. This last option is only useful if you run PostgreSQL on a remote (or virtual) machine. Since we are deploying the app locally, you should replace it with `localhost`.
    Note that you will need to configure PostgreSQL to listen to certain address ranges to be able to connect remotely (this is done in the postgresql.conf file). You may also configure authentication mechanisms within the pg_hba.conf file.
    I usually leave the port at its default value (5432).
    
3. We will not use the default user and database, as this is the default postgres superuser; it got admin rights on the default database and schema; and has no password set by default.
    
    Let’s make our own user and database, and give it the necessary privileges:
    
    ```
    postgres=# create user cashchan;
    CREATE ROLE
    postgres=# create database cashchandb;
    CREATE DATABASE
    postgres=# grant all privileges on database cashchandb to cashchan;
    GRANT
    postgres=# alter role cashchan with password 'your secure password here';
    ALTER ROLE
    postgres=# alter database cashchandb owner to cashchan;
    ALTER DATABASE
    postgres=# 
    \q
    postgres@debian12-woa-deploy : ~
    $ psql -U cashchan -d cashchandb -h localhost
    Mot de passe pour l'utilisateur cashchan : 
    psql (15.5 (Debian 15.5-0+deb12u1))
    Connexion SSL (protocole : TLSv1.3, chiffrement : TLS_AES_256_GCM_SHA384, compression : désactivé)
    Saisissez « help » pour l'aide.
    
    cashchandb=> \dt
    Aucune relation n'a été trouvée.
    cashchandb=>
    \q
    ```
    
4. The following is the script to create the tables in the database:
    
    ```
    CREATE TABLE users (
        id serial NOT NULL,
        username varchar(255) NOT NULL,
        email varchar(255) NULL,
        password varchar(255) NOT NULL,
        PRIMARY KEY(id)
    );
    
    CREATE TABLE chans (
        id serial NOT NULL,
        title varchar(255) NOT NULL,
        description varchar(255) NOT NULL,
        PRIMARY KEY(id)
    );
    
    CREATE TABLE belongs (
        userid integer NOT NULL,
        chanid integer NOT NULL,
        rights boolean NOT NULL,
        PRIMARY KEY(userid, chanid),
        FOREIGN KEY(userid) REFERENCES users(id),
        FOREIGN KEY(chanid) REFERENCES chans(id)
    );
    
    CREATE TABLE transactions (
        id serial NOT NULL,
        title varchar(255) NOT NULL,
        amount real NOT NULL,
        date date,
        chanid integer NOT NULL,
        PRIMARY KEY(id),
        FOREIGN KEY(chanid) REFERENCES chans(id)
    );
    
    CREATE TABLE fulfills (
        transid integer NOT NULL,
        userid integer NOT NULL,
        part real NOT NULL,
        PRIMARY KEY(transid, userid),
        FOREIGN KEY(transid) REFERENCES transactions(id),
        FOREIGN KEY(userid) REFERENCES users(id)
    );
    ```
    
    The script can be pasted directly into the command line:
    
    ```
    cashchandb=> CREATE TABLE users ( 
    	...
    
    CREATE TABLE
    CREATE TABLE
    CREATE TABLE
    CREATE TABLE
    CREATE TABLE
    cashchandb=> \dt
                 Liste des relations
     Schéma |     Nom      | Type  | Propriétaire 
    --------+--------------+-------+--------------
     public | belongs      | table | postgres
     public | chans        | table | postgres
     public | fulfills     | table | postgres
     public | transactions | table | postgres
     public | users        | table | postgres
    (5 lignes)
    ```
    
    The commands outputs ‘CREATE TABLE’ meaning the table was successfully created.
    The `\dt` PostgreSQL command displays all the tables in the current schema.
    
    The database has been successfully initialized.
    
5. The application uses environment variables defined in the server config. There are many ways to set these variables:
    - As the server is launched, in command line options,
    - In a .env file called in the command line,
    - With the `putenv()` function,
    - Using the $_ENV global variable,
    - …
    
    Since we are deploying the app locally, in a development context, we will simply define these values as regular variables.
    This is must not be done in a production environment.
    Simply fill in the values in the `secrets.php` file:
    
    ```
    <?php
    
    // This file should not exist in a deployed production environment.
    // If you choose to keep this file, modify its rights to restrict its access.
    
    ...
    
    // For a local deployment:  ################################
    $dbhostaddr = '127.0.0.1';  // IP of the Postgres VM.
    $dbport = '5432';  // Port that Postgres is listening to on the VM.
    $dbname = 'cashchandb';  // Name of the remote database.
    $dbuser = 'cashchan';  // Name of the remote database's user.
    $dbpassword = 'a secure password';  // Remote database password.
    $secretKey = 'a secure key';  // Secret key used to generate and validate JSON Web tokens.
    
    ?>
    ```
    
    Since you have the default configuration for PostgreSQL and are deploying locally, you need to write `127.0.0.1` as a value for the `$dbhostaddr` variable, as PostgreSQL only listens to localhost by default, for security reasons.
    
6. After having cloned the contents of the github repository to your machine, place yourself in the cloned directory and execute the following command to start the PHP Web server locally:
    
    ```
    root@debian12-woa-deploy : ~/cash-chan
    # php -S localhost:8000
    [Wed Jan 31 13:53:53 2024] PHP 8.2.7 Development Server (http://localhost:8000) started
    ```
    
    I use port 8000 instead of 80 to avoid conflicts. In addition, not all users are allowed to bind certain ports. This step can be done as `root` , as a standard user or as one you would have created to manage the app.
    Notice that I am placed inside the `cash-chan` directory.
    
7. Connect from a browser on your machine.
    
    \<Screenshot of browser screen showing Cash-chan log in interface. Available in Notion>
    
    If no PostgreSQL connection error appears on the console, then everything was set up correctly. Good job!




       
