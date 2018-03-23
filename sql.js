﻿var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'Dw3c9Np$Bx5j',
    database: 'wora'
});

// Most of this is atm vulnerable to SQL injection. Fix in future if I find time.

connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected");
    } else {
        console.log("Error connecting database: "+err);
    }
});

async function checkexist(id, fn) {
    var returned;
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM servers WHERE servers.serverid = " + id.toString() + "", async function ExistCheck(err, result, fields) {
            returned = false;
            //console.log("Checking for " + id);
            result.forEach(function (e, err) {
                returned = true;
            });
            resolve(returned);
        });
    });
}

async function createserver(id,servername,members,prefix,owner,region) {
    var returned;
    return new Promise(function (resolve, reject) {
        servername = servername.replace("'", "''");
        owner = owner.replace("'", "''");
        region = region.replace("'", "''");
        connection.query("INSERT INTO servers (`serverid`, `servername`, `members`, `prefix`, `owner`, `region`) VALUES ('" + id.toString() + "', '" + servername + "', '" + members.toString() + "', '" + prefix + "', '" + owner + "', '"+region+"');", async function ExistCheck(err, result) {
            if (err) {
                console.log(err);
                resolve("Couldn't create record!");
            }
            resolve("Successfully added");
        });
    });
}


//UPDATE `database`.`servers` SET `servername`='34', `members`='60', `prefix`='34', `owner`='34', `region`='34' WHERE `serverid`='250621419325489153';

function updateall(id, servername, members, owner, region) {
    var returned;
    return new Promise(function (resolve, reject) {
        servername = servername.replace("'", "''");
        owner = owner.replace("'", "''");
        region = region.replace("'", "''");
        connection.query("UPDATE `servers` SET `servername`='" + servername + "', `members`='" + members.toString() + "', `owner`='" + owner + "', `region`='" + region + "' WHERE `serverid`='" + id.toString() + "';", async function ExistCheck(err, result) {
            if (err) {
                console.log(err);
                resolve("Couldn't create record!");
            }
            resolve("Successfully added");
        });
    });
}

function update(id, toset, newval) {
    var returned;
    return new Promise(function (resolve, reject) {
        connection.query("UPDATE `servers` SET `"+toset+"`='" + newval  + "' WHERE `serverid`='" + id.toString() + "';", async function ExistCheck(err, result) {
            if (err) {
                console.log(err);
                resolve("Couldn't create record!");
            }
            resolve("Successfully changed");
        });
    });
}


function checkprefix(id) {
    var returned;
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM servers WHERE servers.serverid = " + id.toString() + "", async function ExistCheck(err, result, fields) {
            returned = "";
            //console.log("Checking for " + id);
            result.forEach(function (e, err) {
                returned = e.prefix;
            });
            resolve(returned);
        });
    });
}

function checkvalue(id,valuetocheck) {
    var returned;
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM servers WHERE servers.serverid = " + id.toString() + "", async function ExistCheck(err, result, fields) {
            returned = "";
            //console.log("Checking for " + id);
            result.forEach(function (e, err) {
                returned = e[valuetocheck];
            });
            resolve(returned);
        });
    });
}

function deleterecord(id) {
    var returned;
    return new Promise(function (resolve, reject) {
        connection.query("DELETE FROM webhooks WHERE webhook='" + id.toString() + "';", async function ExistCheck(err, result) {
            if (err) {
                console.log(err);
                resolve("Couldn't delete record!");
            }
            resolve("Successfully deleted");
        });
    });
}

module.exports = {
    getserver: async function (id) {
        var boola = await checkexist(id);
        return boola;
    },

    create: async function (id, servername, members, prefix, owner, region) {
        var boola = await createserver(id, servername, members, prefix, owner,region);
        return boola;
    },

    update: function (serverid, servername, members, owner, region) {
        updateall(serverid, servername, members, owner, region);
    },

    delete: async function (deleteid) {
        boola = await deleterecord(deleteid);
        return boola;
    },

    getprefix: async function (serverid) {
        boola = await checkprefix(serverid);
        return boola;
    },

    setprefix: async function (serverid,newprefix) {
        boola = await update(serverid,"prefix",newprefix);
        console.log("set prefix: " + boola);
        return boola;
    },

    setplaytime: async function (serverid, newprefix) {
        boola = await update(serverid, "maxplaytime", newprefix);
        console.log("set playtime: " + newprefix);
        return boola;
    },

    updatevalue: async function (serverid,valuetoupdate, newvalue) {
        boola = await update(serverid, valuetoupdate, newvalue);
        console.log("set newvalue: " + newvalue);
        return boola;
    },

    getvalue: async function (serverid, valuetotcheck) {
        boola = await checkvalue(serverid, valuetotcheck);
        return boola;
    },

    createwebhook: async function (id, webhook) {
    var returned;
    return new Promise(function (resolve, reject) {
        connection.query("INSERT INTO webhooks (`webhook`, `serverid`) VALUES ('" + webhook.toString() + "','" + id.toString() + "');", async function ExistCheck(err, result) {
            if (err) {
                console.log(err);
                resolve("Couldn't create record!");
            }
            resolve("Successfully added");
        });
    });
    },

    getallwebhooks: async function (id) {
        var returned;
        return new Promise(function (resolve, reject) {
            connection.query("SELECT * FROM webhooks WHERE  serverid=" + id + ";", async function ExistCheck(err, result) {
                if (err) {
                    console.log(err);
                    resolve("Couldn't retrieve record!");
                }
                resolve(result);
            });
        });

    },

    getsetup: async function () {
        var returned;
        return new Promise(function (resolve, reject) {
            connection.query("SELECT * FROM webhooks;", async function ExistCheck(err, result) {
                if (err) {
                    console.log(err);
                    resolve("Couldn't retrieve record!");
                }
                resolve(result);
            });
        });

    },
};