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
