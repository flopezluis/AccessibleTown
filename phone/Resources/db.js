Titanium.include('/aes/aes.js', '/aes/aes_ctr.js', '/aes/base64.js', '/aes/utf8.js');
function DB() {
        /*
        * The database is NOT a common database, we only store the id, the json and the fields you use to filter.
        * We store the json because it's very useful in js and with titanium.
        * the Json has:
        * {title: , body:, id:,type:, poll_id:}
        *
        * ALL the items are supposed to be ordered in the API, that's why the tables have a field DATE_CREATED with CURRENT_TIMESTAMP and they are returned in that order
        */
        var ACCESSIBLE_TOWN_DB = 'accessible_town' + '_v1';
        var USER_TABLE = 'SESSION';        
        var CREATE_USER_TABLE = 'CREATE TABLE IF NOT EXISTS ' + USER_TABLE + ' (SESSION)';       
        var password = 'supersecretkey:)';
        var SECOND = 1000;
        var MINUTE = 60 * SECOND;
        var MONTH = 30 * (24*(60*MINUTE));

        var db = Titanium.Database.open(ACCESSIBLE_TOWN_DB);       
        db.execute(CREATE_USER_TABLE);                
        db.close();
        
        /*
        * Return an array whith the  json
        */
        function get(sql) {
            var data = [];
            var db = Titanium.Database.open(ACCESIBLE_TOWN_DB);
            var rows = db.execute(sql);
            while (rows.isValidRow()) {
                var row = JSON.parse(rows.fieldByName('JSON'));
                data.push(row);
                rows.next();
            }
            rows.close();
            db.close(); // close db when you're done to save resources
            return data;
        }          

         /* ---------- CODE RELATED TO SESSION ------------//{{{
        * Save the session
        */
        function saveSession() {
            var db = Titanium.Database.open(ACCESSIBLE_TOWN_DB);
            var ciphertext = Aes.Ctr.encrypt(Titanium.App.Properties.getString("login"), password, 256);
            db.execute('INSERT INTO ' + USER_TABLE + ' (SESSION ) VALUES(?)', ciphertext);
            db.close();             
        }
        /*
        * delete the session
        */
        function resetSession() {
            var db = Titanium.Database.open(ACCESSIBLE_TOWN_DB);
            db.execute(CREATE_USER_TABLE);            
            db.execute('DELETE FROM ' + USER_TABLE);
            db.close();             
            Titanium.App.Properties.removeProperty("login");
        }        
        /*
        * It there is a session stored then load it.
        */
        function loadSession() {
            var db = Titanium.Database.open(ACCESSIBLE_TOWN_DB);
            db.execute(CREATE_USER_TABLE);
            var sql = 'SELECT * FROM  ' + USER_TABLE;
            var rows = db.execute(sql);
            if (rows.getRowCount()) {
                var session = Aes.Ctr.decrypt(rows.field(0), password, 256);
                Titanium.App.Properties.setString("login", session);
            }
            rows.close();
            db.close();

        }        //}}}

        return {
            saveSession:saveSession,
            loadSession:loadSession,
            resetSession:resetSession
        }
}
