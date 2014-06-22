alat.local = new Object();

alat.local.Table = function() {
    this.rowdict = {};
    this.rowid = null;
    this.rowid_seq = 0;
    this.insert_row = function(dict) {
        this.rowid = this.rowid_seq;
        this.rowdict[this.rowid]=alat.lib.nvl(dict,{});
        this.rowid_seq++;
    }
    this.set = function(varname,value) {
        this.rowdict[this.rowid][varname]=value;
    }
    this.get = function(varname) {
        var row = this.rowdict[this.rowid];
        if (row!=null) {
            return row[varname];
        }
        return null;
    }
    this.delete_row = function() {
        delete this.rowdict[this.rowid];
        this.rowid = null;
    }
    this.json = function() {
        var result = [];
        for (var i in this.rowdict) {
            var d = this.rowdict[i];
            d['ROWID']=i;
            result.push(this.rowdict[i]);
        }
        return result;
    }
    this.json_col_rename = function(old_json,old_name,new_name) {
        var new_json = [];
        for (var i in old_json) {
            var d = old_json[i];
            if (d[old_name]) {
                d[new_name] = d[old_name];
                delete d[old_name];
            }
            new_json.push(d);
        }
        return new_json;
    }
	this.norm = function(resultdict) {
		var header = [];
		var data = [];
		for (var rowid in resultdict) {
			var row = resultdict[rowid];
			for (var colname in row) {
				if ( header.indexOf(colname)==-1) {
					header.push(colname);
				}
			}
			var l = [];
			for (var i=0;i<header.length;i++) {
					l.push(row[header[i]]);
			}
			data.push(l);
		}
		return {header:header,data:data};
	}
    this.filter = function( filter_expr ) {
		// filter_expr example: "row['CUSTOMER_ID']<5"
        var resultdict = {}
        for (var rowid in this.rowdict) {
            var row = this.rowdict[rowid];
			if ( filter_expr == null ) {
                resultdict[rowid]=this.rowdict[rowid];				
            } else if ( eval(filter_expr) ) {
                resultdict[rowid]=this.rowdict[rowid];
            }
        }
        return resultdict;
    }
}

//for (var x in this.buffer.multiposdict)

// ------------------------------------------
// Local client javascript server for testing
// ------------------------------------------
alat.local.Server = function() {
    this.tables = new Object();     // collection of table objects
    this.blocks = {};               // collection of block classes - javascript client classes
    this.calls = {};                // dictionary of functions ( function(data) return jscode; ) - server functions
    this.init_call = function() {}; // define session id and initial block - override
}
alat.local.server = new alat.local.Server();


// ---------------------------------------
// alat.manager server-specific overriding
// ---------------------------------------
alat.manager.call_block = function(blockname,data,callback) {
    //alert(blockname+" --> "+alat.lib.str(data));
    var block = new alat.local.server.blocks[blockname](data,callback);
    b = block;
    t = alat.local.server.tables;
    alat.manager.open_block(block);
}
alat.manager.call_server = function(block,callback_name,data) {
	var jscode = alat.local.server.calls[callback_name](alat.lib.nvl(data,{}));
	return block.eval(jscode);
}


