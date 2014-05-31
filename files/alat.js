// --------------------------
// Root namespace for classes
// --------------------------
alat = new Object();
alat.gui = new Object();

// Path string to main location
// To be changed for component loading purposes
alat.path = '';

// ---------
// Constants
// ---------
alat.const = new Object();
// Class Names
alat.const.CLASS_FIELD = 'FIELD';
alat.const.CLASS_ROW = 'ROW';
alat.const.CLASS_BUFFER = 'BUFFER';
alat.const.CLASS_KEY_HANDLER = 'KEY_HANDLER';
alat.const.CLASS_BLOCK = 'BLOCK';     
alat.const.CLASS_EVENTDATA = 'EVENTDATA';
alat.const.CLASS_EVENT = 'EVENT';
alat.const.CLASS_EVENT_MANAGER = 'EVENT_MANAGER';
alat.const.CLASS_MANAGER = 'MANAGER';
// Datatype Names
alat.const.DATATYPE_INTEGER = 'INTEGER';
alat.const.DATATYPE_FLOAT = 'FLOAT';
alat.const.DATATYPE_STRING = 'STRING';
alat.const.DATATYPE_BOOLEAN = 'BOOLEAN';
alat.const.DATATYPE_DATETIME = 'DATETIME';
// Fieldtype Names
alat.const.FIELDTYPE_VARIABLE = 'VARIABLE';
alat.const.FIELDTYPE_COLUMN = 'COLUMN';
// Row Status Names
alat.const.ROWSTATUS_NULL = null; 
alat.const.ROWSTATUS_DELETE = 'DELETE'; 
alat.const.ROWSTATUS_INSERT = 'INSERT';
alat.const.ROWSTATUS_UPDATE = 'UPDATE';
// Event Names
alat.const.EVENT_CHANGE = 'CHANGE';
alat.const.EVENT_ACTION = 'ACTION';
alat.const.EVENT_ROW_BEFORE = 'ROW_BEFORE';
alat.const.EVENT_ROW_AFTER = 'ROW_AFTER';
alat.const.EVENT_REFRESH_GUI = 'REFRESH_GUI';
alat.const.EVENT_BLOCK_BEFORE = 'BLOCK_BEFORE';
alat.const.EVENT_BLOCK_AFTER = 'BLOCK_AFTER';
// Sub-CallBlock Events
alat.const.EVENT_SUB_CALLBLOCK = [
    alat.const.EVENT_CHANGE,
    alat.const.EVENT_ROW_BEFORE,
    alat.const.EVENT_ROW_AFTER,
    alat.const.EVENT_ACTION
];
// Event Stages
alat.const.EVENT_STAGE_TYPE_GOTO_ROW = 'GOTO_ROW';
alat.const.EVENT_STAGE_TYPE_WRITE_ROW = 'WRITE_ROW';
alat.const.EVENT_STAGE_TYPE_INSERT_ROW = 'INSERT_ROW';
alat.const.EVENT_STAGE_TYPE_DELETE_ROW = 'DELETE_ROW';
alat.const.EVENT_STAGE_TYPE_PUT = 'PUT';
alat.const.EVENT_STAGE_TYPE_SET = 'SET';
alat.const.EVENT_STAGE_TYPE_GET = 'GET';
alat.const.EVENT_STAGE_TYPE_CLOSE_BLOCK = 'CLOSE_BLOCK';
// Keyboard constants
alat.const.KEY_HANDLER_TARGET_INSERT_ROW = "INSERT_ROW";
alat.const.KEY_HANDLER_TARGET_DELETE_ROW = "DELETE_ROW";
alat.const.KEY_HANDLER_TARGET_ACTION = "ACTION";

// -------
// Library
// -------
alat.lib = new Object();
// function nvl: returns specified value if null
alat.lib.nvl = function(value,nullvalue) {
    if (value==null) {
        return nullvalue;
    }
    return value;
}
// function str(expr)
alat.lib.str = function(obj) {
	return JSON.stringify(obj);
} 
// function keys(dict): returns list of keys
alat.lib.keys = Object.keys;
// funtion log(message)
alat.lib.log = function(message) {
    if (console) {
        console.log(message);
    }
}
alat.lib.lpad = function(str,char,maxlength) {
    var l = maxlength-str.length;
    for(var i=0;i<l;i++) {
        str = char + str;
    }
    return str;
}
alat.lib.isdigits = function(str) {
    if (str==null) {
        return false;
    }
    var dig = str.match(/[0-9]/g);
    if (dig==null) {
        return false;
    }
    return str.length>0 && str.length == dig.length;
}
alat.lib.round = function(value,places) {
    if (typeof value != "number" || typeof places != "number" ) {
        return value;
    }
    var multiplier = Math.pow(10,places);
    return (Math.round(value * multiplier) / multiplier);
}

// ----------------
// Class AlatObject
// Generic stuff
// ----------------
alat.AlatObject = function(classname) {
	// class identification
    this.className = classname;
	// additional attr property (dictionary) - mostly for gui
	this.attr = {};
}


// ----------------------------------
// Class Field
// Interface to column data in buffer
// ----------------------------------
alat.Field = function(block,name,datatype,domain) {
    // generic alat object inheritance
    alat.AlatObject.call(this,alat.const.CLASS_FIELD);
    // parent block
    this.block = block;
    // name property
    this.name = name;
	// action_name property - actionname for ActionEvent
	this.action_name = null;
    // domain dictionary
    this.domain = alat.lib.nvl(domain,{});
    // Function set_action(actionname)
	this.set_action = function(actionname) {
		this.action_name = actionname;
	}
    // datatype property
    this.datatype = datatype;
    // fieldtype property
    this.fieldtype = null;
    // readonly property: can be callback object, true or false
    this.readonly = false;
	// change_flag property: true if should be put to changedict, false otherwise 
	this.change_flag = false;
    // function string2datatype: data transformation method - from string to datatype
    // if undefined then previous value should be used in gui
    this.string2datatype = function(value) {
        return value;
    }
    // function datatype2string: data transformation method - from datatype to string
    this.datatype2string = function(value) {
        return alat.lib.nvl(value,"");
    }    
    // function server2datatype: transform data from server to datatype
    this.server2datatype = function(value) {
        return alat.lib.nvl(value,"");
    }    
    // function datatype2server: transform data from datatype to server
    this.datatype2server = function(value) {
        return alat.lib.nvl(value,"");
    }    
    // function is_valid_so_far: is value valid so far
    // used for dataentry interactive control
    this.is_valid_so_far = function(value) {
        return true;
    }
    // function is_variable: returns true if field is variable
    this.is_variable = function() { 
        return this.fieldtype==alat.const.FIELDTYPE_VARIABLE; 
    }
    // function is_column: returns true if field is column
    this.is_column = function() {
        return this.fieldtype==alat.const.FIELDTYPE_COLUMN; 
    }
    // function is_readonly
    this.is_readonly = function() {
        return this.block.expr(this.readonly);
    }
    // init property - Callback object
    this.init = undefined;
    // recalc property - Callback object
    this.recalc = undefined;
    // list of fields whose value changes recalcs this field
    this.source_fieldname_list = [];
    // list of fields that recalculates if value of this field change
    this.recalc_fieldname_list = [];
    // make_init - init definition
    this.make_init = function(init_callback_value) {
        //this.init = new alat.Expression(this.block,init_expression_value);
		this.init = init_callback_value;
    }
    // make_recalc - recalculation definition
    this.make_recalc = function(recalc_callback_value,source_fieldname_list) {
        //this.recalc = new alat.Expression(this.block,recalc_expression_value);
        this.recalc = recalc_callback_value;
        this.source_fieldname_list = source_fieldname_list;
        // sync source and recalc lists
        this.block.buffer.add_recalc(this);
    }     
    // Set field as variable and add it to buffer
    this.variable = function() {
        if (this.fieldtype==null) {
            this.fieldtype=alat.const.FIELDTYPE_VARIABLE;
            this.change_flag = false;
            this.block.buffer.add_field(this);
        }
        return this; // for easier declaration
    }
    // Set field as column and add it to buffer
    this.column = function() {
        if (this.fieldtype==null) {
            this.fieldtype=alat.const.FIELDTYPE_COLUMN;
            this.change_flag = true;
            this.block.buffer.add_field(this);
        }
        return this; // for easier declaration
    }
}

// ----------------------------
// Field subclasses - Datatypes
// ----------------------------
alat.Integer = function(block,name,domain) {
    alat.Field.call(this,block,name,alat.const.DATATYPE_INTEGER,domain);
    // domain defaults
    this.domain.min_value = alat.lib.nvl(this.domain.min_value,null); // null = unlimited
    this.domain.max_value = alat.lib.nvl(this.domain.max_value,null); // null = unlimited
    this.domain.thousand_separator = alat.lib.nvl(this.domain.thousand_separator,',');
    this.domain.show_thousand_separator = alat.lib.nvl(this.domain.show_thousand_separator,false);    
    // function string2datatype: data transformation method - from string to datatype
    this.string2datatype = function(value) {
        if (typeof value == "string") {
            var s = value;
        } else {
            var s = alat.lib.str(value);
        }
        // 
        var s2 = "";
        for (var i in s) {
            var c = s[i];
            if ("0123456789".indexOf(c)>=0) {
                s2 += c;
            } 
            else if ("+ ".indexOf(c)>=0 && s2.length==0) {
                // ignore
            }
            else if (c=='-' && s2.length==0) {
                s2 += c;
            }
            else if (c==this.domain.thousand_separator && s2.indexOf(this.domain.decimal_separator)==-1) {
                // ignore
            }
            else {
                return undefined;
            }
        }
        var v = parseInt(s2);
        if (isNaN(v)) { return undefined };
        if (this.domain.min_value!=null && v<this.domain.min_value) { return undefined };
        if (this.domain.max_value!=null && v>this.domain.max_value) { return undefined };        
        return v;            
    }
    // function datatype2string: data transformation method - from datatype to string
    this.datatype2string = function(value) {
        if (value==null) {
            return "";
        }
        var v = Math.abs(value).toString();
        var s = "";
        if (this.domain.show_thousand_separator) {
            var c = 1;
            for (var i=v.length;i>0;i--) { 
                if (c == 4) {
                    s = this.domain.thousand_separator + s;
                    c = 1;
                }
                s = v[i-1] + s;
                c++;
            }
        } else {
            s = v;
        }
        if (value<0) {
            s = '-' + s;
        }
        return alat.lib.nvl(s,"");
    }    
}

alat.Float = function(block,name,domain) {
    alat.Field.call(this,block,name,alat.const.DATATYPE_FLOAT,domain);
    this.domain.min_value = alat.lib.nvl(this.domain.min_value,null); // null = unlimited
    this.domain.max_value = alat.lib.nvl(this.domain.max_value,null); // null = unlimited
    this.domain.decimal_separator = alat.lib.nvl(this.domain.decimal_separator,'.');
    this.domain.thousand_separator = alat.lib.nvl(this.domain.thousand_separator,',');
    this.domain.show_thousand_separator = alat.lib.nvl(this.domain.show_thousand_separator,true);  
    this.domain.round = alat.lib.nvl(this.domain.round,null); // null = no round
    // function string2datatype: data transformation method - from string to datatype
    this.string2datatype = function(value) {
        if (typeof value == "number") {
            if (this.domain.min_value!=null && value<this.domain.min_value) { return undefined };
            if (this.domain.max_value!=null && value>this.domain.max_value) { return undefined };
            return alat.lib.round(value, this.domain.round);            
        }
        if (typeof value == "string") {
            var s = value;
        } else {
            var s = alat.lib.str(value);
        }
        // 
        var s2 = "";
        for (var i in s) {
            var c = s[i];
            if ("0123456789".indexOf(c)>=0) {
                s2 += c;
            } 
            else if ("+ ".indexOf(c)>=0 && s2.length==0) {
                // ignore
            }
            else if (c=='-' && s2.length==0) {
                s2 += c;
            }
            else if (c==this.domain.decimal_separator && s2.indexOf(this.domain.decimal_separator)==-1) {
                s2 += c;
            }
            else if (c==this.domain.thousand_separator && s2.indexOf(this.domain.decimal_separator)==-1) {
                // ignore
            }
            else {
                return undefined;
            }
        }
        var l = s2.split(this.domain.decimal_separator);
        if (l.length<1 || l.length>2) { return undefined };
        var v = parseFloat(l[0].trim()+"."+alat.lib.nvl(l[1],"").trim());
        if (isNaN(v)) { return undefined };
        if (this.domain.min_value!=null && v<this.domain.min_value) { return undefined };
        if (this.domain.max_value!=null && v>this.domain.max_value) { return undefined };
        v = alat.lib.round(v, this.domain.round);
        return v;            
    }
    // function datatype2string: data transformation method - from datatype to string
    this.datatype2string = function(value) {
        if (value==null) {
            return "";
        }
        var l = Math.abs(value).toString().split('.');
        var s = "";
        if (this.domain.show_thousand_separator) {
            var c = 1;
            for (var i=l[0].length;i>0;i--) { 
                if (c == 4) {
                    s = this.domain.thousand_separator + s;
                    c = 1;
                }
                s = l[0][i-1] + s;
                c++;
            }
        } else {
            s = l[0];
        }
        if (l.length>1) {
            s = s + this.domain.decimal_separator + l[1];
        }
        if (value<0) {
            s = '-' + s;
        }
        return alat.lib.nvl(s,"");
    }    
}

alat.String = function(block,name,domain) {
    alat.Field.call(this,block,name,alat.const.DATATYPE_STRING,domain);
    this.domain.trim = alat.lib.nvl(this.domain.trim,true);
    this.domain.upper = alat.lib.nvl(this.domain.upper,false);
    this.domain.lower = alat.lib.nvl(this.domain.lower,false);
    // function string2datatype: data transformation method - from string to datatype
    this.string2datatype = function(value) {
        var v = "";
        if (typeof value == "string") {
            v = value;
        } else if ( value == null) {
            return null;
        } else {
            v = alat.lib.str(value);
        }
        if (this.domain.trim) {
            v = v.trim();
        }
        if (this.domain.upper) {
            v = v.toLocaleUpperCase();
        }
        if (this.domain.lower) {
            v = v.toLocaleLowerCase();
        }
        if (v == "") {
            v = null;
        }
        return v;
    }
    // function datatype2string: data transformation method - from datatype to string
    this.datatype2string = function(value) {
        return alat.lib.nvl(value,"");
    }    
}

alat.Boolean = function(block,name,domain) {
    alat.Field.call(this,block,name,alat.const.DATATYPE_BOOLEAN,domain);
    this.domain.yes = alat.lib.nvl(this.domain.yes,'Yes');
    this.domain.no = alat.lib.nvl(this.domain.no,'No');
    // function string2datatype: data transformation method - from string to datatype
    this.string2datatype = function(value) {
        if (typeof value == "string") {
            if (value.length>0) {
                if (value.toLocaleLowerCase()==this.domain.yes.toLocaleLowerCase().substr(0,value.length)) {
                    return true;
                }
                if (value.toLocaleLowerCase()==this.domain.no.toLocaleLowerCase().substr(0,value.length)) {
                    return false;
                }
            }
            if (value=="") {
                return null;
            }
        }
        if (value==null) {
            return null;
        }
        if (value===true) {
            return true;
        }
        if (value===false) {
            return false;
        }
        return undefined;
    }
    // function datatype2string: data transformation method - from datatype to string
    this.datatype2string = function(value) {
        if (typeof value == "string") {
            if (value.toLocaleLowerCase()==this.domain.yes.toLocaleLowerCase()) {
                return this.domain.yes;
            }
            if (value.toLocaleLowerCase()==this.domain.no.toLocaleLowerCase()) {
                return this.domain.no;
            }        
        }
        if (value==null) {
            return "";
        }
        if (value===true) {
            return this.domain.yes;
        }
        if (value===false) {
            return this.domain.no;
        }
        return "";
    }    
}

alat.Datetime = function(block,name,domain) {
    alat.Field.call(this,block,name,alat.const.DATATYPE_DATETIME,domain);
    this.domain.format = alat.lib.nvl(this.domain.format,'DD.MM.YYYY');
    this.domain.server_format = alat.lib.nvl(this.domain.server_format,'YYYY-MM-DD');
    // function string2datatype: data transformation method - from string to datatype
    this.string2datatype = function(value,format) {
        if (value=="" || value==null) {
            return null;
        }
        // If string parse format
        if (typeof value == "string") {
            var sv = value;
            var sf = this.domain.format;
            if (typeof format == "string") {
                sf = format;
            }
            var day = null;
            var month = null;
            var year = null;
            while (sf.length>0) {
                sv = sv.trim();
                sf = sf.trim();
                //alat.lib.log('SF:'+sf+' SV:'+sv);
                if (sf.substr(0,2)=='DD') {
                    day = sv.substr(0,2);
                    if (alat.lib.isdigits(day)==false) { return undefined; }
                    sv = sv.substr(2);
                    sf = sf.substr(2);
                } else 
                if (sf.substr(0,2)=='MM') {
                    month = sv.substr(0,2);
                    if (alat.lib.isdigits(month)==false) { return undefined; }
                    sv = sv.substr(2);
                    sf = sf.substr(2);
                } else
                if (sf.substr(0,4)=='YYYY') {
                    year = sv.substr(0,4);
                    if (alat.lib.isdigits(year)==false) { return undefined; }
                    sv = sv.substr(4);
                    sf = sf.substr(4);
                } else 
                if (sf.length>0 && sv.length>0 && alat.lib.isdigits(sv.substr(0,1))==false) {
                    sv = sv.substr(1);
                    sf = sf.substr(1);                    
                } else {
                    return undefined;                    
                }
            }
            var d = new Date(year,month-1,day);
            d.setFullYear(year);
            // corect date check
            if (day==d.getDate() && month==d.getMonth()+1 && year==d.getFullYear()) {
                return d;
            }
            return undefined;
        }
        // If date return as is
        if (value.setDate) {
            return value;
        }
        return undefined;
    }
    // function datatype2string: data transformation method - from datatype to string
    this.datatype2string = function(value,format) {
        if (value==null) {
            return null;
        }
        // If date
        if (value.setDate) {
            var day = alat.lib.lpad(alat.lib.str(value.getDate()),'0',2);
            var month = alat.lib.lpad(alat.lib.str(value.getMonth()+1),'0',2);
            var year = alat.lib.lpad(alat.lib.str(value.getFullYear()),'0',4);
            var sv = "";
            var sf = this.domain.format;
            if (typeof format == "string") {
                sf = format;
            }
            while (sf.length>0) {
                sv = sv.trim();
                sf = sf.trim();
                if (sf.substr(0,2)=='DD') {
                    sv = sv + day;
                    sf = sf.substr(2);
                } else 
                if (sf.substr(0,2)=='MM') {
                    sv = sv + month;
                    sf = sf.substr(2);
                } else
                if (sf.substr(0,4)=='YYYY') {
                    sv = sv + year;
                    sf = sf.substr(4);
                } else 
                if (sf.length>0) {
                    sv = sv + sf.substr(0,1);
                    sf = sf.substr(1);                    
                } 
            }
            return sv;
        }
        if (typeof value == "string") {
            return value;
        }
        return null;
    }    
    // function server2datatype: transform data from server to datatype
    this.server2datatype = function(value) {
        return this.string2datatype(value,this.domain.server_format);
    }    
    // function datatype2server: transform data from datatype to server
    this.datatype2server = function(value) {
        return this.datatype2string(value,this.domain.server_format);
    }    
}

// -----------------------------
// Class Row
// Row data and status container
// -----------------------------
alat.Row = function(block) {
    // generic alat object inheritance
    alat.AlatObject.call(this,alat.const.CLASS_ROW);
    // parent block
    this.block = block;
    // rowid identificator
    this.rowid = block.buffer.rowid_counter++;
    // row status
    this.status = alat.const.ROWSTATUS_UPDATE; // Possible values: null, DELETE, INSERT, UPDATE
    // value list
    this.multivaluelist = [];
};


// -----------------------
// Class Buffer
// Data container in block
// ----------------------- 
alat.Buffer = function(block) {
    // generic alat object inheritance
    alat.AlatObject.call(this,alat.const.CLASS_BUFFER);
    // parent block
    this.block = block;
    // field dictionary fielddict[fieldname]=fieldobject
    this.fielddict = {};
    // list of field objects
    this.fieldlist = [];
    // dictionary for single value fields (variables) - values
    this.singlevaluedict = {};
    // dictionary for multi value fields (columns) position in row multivaluelist
    this.multiposdict = {};
    // counter for single value fields (variables)
    this.singlecount = 0;
    // counter for multi value fields (columns)
    this.multicount = 0;
    // dictionary for changed fields in current row
    this.changedict = {};
    // dictionary for recalculated fields in current row
    this.recalcdict = {};
    // list of rowids for row ordering
    this.rowidlist = [];
    // dictionary of rows - rowdict[rowid] = row object
    this.rowdict = {};
    // counter for next rowid
    this.rowid_counter = 0;        
    // rowid: rowid of current row
    this.rowid = null;
    // function add_field: for adding fields and changing buffer datastructures
    this.add_field = function(new_field_object) {
        this.fielddict[new_field_object.name]=new_field_object;
        this.fieldlist.push(new_field_object);
        if ( new_field_object.is_variable() ) {
            this.singlecount++;
        }
        else {
            this.multiposdict[new_field_object.name]=this.multicount;
            this.multicount++;
        }    
    }
    // function pos2rowid: converting row pos to rowid
    this.pos2rowid = function(pos) { // former pos2pointer
        var rowid = this.rowidlist[pos];
        if (rowid===undefined) {
            return null;
        }
        return rowid;
    }
    // function pointer2pos: converting rowid to row pos (null if not found)
    this.rowid2pos = function(rowid) { // former pointer2pos
        var pos = this.rowidlist.indexOf(rowid);
        if (pos==-1) {
            return null;
        }
        return pos;    
    }
    // function empty_inserted_row: return true if row has just been inserted to buffer and no user value changes have been made
    this.empty_inserted_row = function(rowid) {
        if (rowid!=null) {
            if (Object.keys(this.changedict).length==0 && this.rowdict[rowid].status==alat.const.ROWSTATUS_INSERT) {
                return true;
            }
        }
        return false;
    }
    // function insert_row: insert empty row after specified rowid
    this.insert_row = function(after_rowid) {
        var after_pos = this.rowid2pos(after_rowid);
        // prepare empty value list
        var r = [];
        for (var i=0;i<this.multicount;i++) {
            r.push(null);
        } 
        // create row object
        var row = new alat.Row(this.block);
        row.multivaluelist = r;
        this.rowid = row.rowid;
        // inserting row object
        // rowid not specified - to the end
        if (after_rowid===undefined) {
            this.rowidlist.push(row.rowid);
            this.rowdict[row.rowid]=row;
            return;
        }
        // rowid not found - before first row
        if (after_pos==null) {
            this.rowidlist.splice(0,0,row.rowid);
            this.rowdict[row.rowid]=row;
            return;
        }
        // rowid found - insert after specified rowid
        this.rowidlist.splice(after_pos+1,0,row.rowid);
        this.rowdict[row.rowid]=row;
        return;
    }
    // function delete_row: delete current rowid (if found)
    this.delete_row = function() {
        var pos = this.rowid2pos(this.rowid);
        // position not null - delete at position
        if (pos != null) {
            this.rowidlist.splice(pos,1);
            delete this.rowdict[this.rowid];
            this.rowid = null;
        }
    }
    // function server_set: set value from server to buffer storage of field
    this.server_set = function(name,value) {
        var f = this.fielddict[name];
        var v = f.server2datatype(value);
        if (f.is_variable()) {
            this.singlevaluedict[name]=v;
        }
        else {
            var x = this.multiposdict[name];
            this.rowdict[this.rowid].multivaluelist[x]=v;
        }
    }    
    // function set: set value to buffer storage of field
    this.set = function(name,value) {
        var f = this.fielddict[name];
        var v = f.string2datatype(value);
        if (f.is_variable()) {
            this.singlevaluedict[name]=v;
        }
        else {
            var x = this.multiposdict[name];
            this.rowdict[this.rowid].multivaluelist[x]=v;
        }
    }
    // function get: get value from buffer storage of field 
    this.get = function(name,rowid) {
        var f = this.fielddict[name];
        if (f.is_variable()) {
            var retval = this.singlevaluedict[name];
            if (retval===undefined) { retval=null; };
            //return f.datatype2string(retval);
            return retval;
        }
        else {
            var x = this.multiposdict[name];
            if (rowid == null) {
                if (this.rowid==null) {
                    return null;
                }
				//return f.datatype2string(this.rowdict[this.rowid].multivaluelist[x]);
                return this.rowdict[this.rowid].multivaluelist[x];
            } else {
                //return f.datatype2string(this.rowdict[rowid].multivaluelist[x]);
                return this.rowdict[rowid].multivaluelist[x];
            }
        }
    }    
    // function add_recalc: synhronizing source and recalc lists of various objects
    this.add_recalc = function(field_object) {
        // for each source field
        for (var i in field_object.source_fieldname_list) {
            var source_fieldname = field_object.source_fieldname_list[i];
            var source_field = this.fielddict[source_fieldname];
            // if this field is not in recalc list of source field then add it
            if (source_field.recalc_fieldname_list.indexOf(field_object.name)==-1) {
                source_field.recalc_fieldname_list.push(field_object.name)
            }
        }
    }
    // function write_changedict: write changed and recalc changes to buffer main value storage
    // recalcdict has priority over changedict
    this.write_changedict = function() {
        // write changes from changedict and reset changedict
        for (var fieldname in this.changedict) {
            this.set(fieldname,this.changedict[fieldname]);
        } 
        this.changedict = {};
        // write changes from recalcdict and reset recalcdict
        for (var fieldname in this.recalcdict) {
            this.set(fieldname,this.recalcdict[fieldname]);
        } 
        this.recalcdict = {};
    }
    // function get_recalc: get value from recalcdict
    this.get_recalc = function(fieldname) {
        var f = this.fielddict[fieldname];
        //return f.datatype2string(this.recalcdict[fieldname]);
        return this.recalcdict[fieldname];
    }    
    // functioon set_recalc: set value to recalcdict and delete from changedict
    this.set_recalc = function(fieldname,newvalue) {
        var f = this.fielddict[fieldname];
        this.recalcdict[fieldname]=f.string2datatype(newvalue);
        delete this.changedict[fieldname];
    }
    // function get_change: get value from changedict
    this.get_change = function(fieldname) {
        var f = this.fielddict[fieldname];
        //return f.datatype2string(this.changedict[fieldname]);
        return this.changedict[fieldname];
    }    
    // function set_change: set value to changedict
    this.set_change = function(fieldname,newvalue) {
        var f = this.fielddict[fieldname];
        var newvalue2 = f.string2datatype(newvalue);
        // if transformed value is not undefined update changedict and delete from recalcdict
        if (!(newvalue2===undefined)) { 
            this.changedict[fieldname]=newvalue2;
            delete this.recalcdict[fieldname];
        }
    }
    // function recalc_walk: when field value changes, recursivly recalculate all dependant fields
    this.recalc_walk = function(from_fieldname) {
        // Recalculation recursive walk
        // inlist: list of fields to check
        var inlist = [from_fieldname];
        // outlist: list of checked fields, in order to prevent double check and circle recalculation
        var outlist = [];
        // list of changed fields (as function return)
        var changedlist = [];
        // while inlist is not empty
        while (inlist.length>0) {
            // source field = pop first element from inlist
            var source_fieldname = inlist.splice(0,1)[0];            
            var source_field = this.fielddict[source_fieldname];
            // for each target field that shoud be recalculated from source field
            for (var i in source_field.recalc_fieldname_list) { 
                var target_fieldname = source_field.recalc_fieldname_list[i];
                // if target field is not in inlist or outlist
                if (inlist.indexOf(target_fieldname)==-1 && outlist.indexOf(target_fieldname)==-1) {
                    // put target field to inlist
                    inlist.push(target_fieldname);
                    // put target field to changedlist
                    changedlist.push(target_fieldname);
                    // recalculate target field
                    var target_field = this.fielddict[target_fieldname];
                    this.set_recalc(target_fieldname,this.block.expr(target_field.recalc)); 
                }
             }
             // put source field to outlist of checked fields
             outlist.push(source_fieldname);                                      
        }
        // return changedlist
        return changedlist;
    } 
	// function get_last_pos 
    this.get_last_pos = function() {
        if (this.rowidlist.length>0) { 
			return this.rowidlist.length-1;
		}
        else { 
			return null; 
		}
    }
	// function get_first_pos
    this.get_first_pos = function() {
        if (this.rowidlist.length>0) { 
			return 0;
		} else { 
			return null; 
		}
    }
	// function get_goal_pos: get specified position - for use in tables
    this.get_goal_pos = function(goal_pos) {
		// if no rows
        if (this.rowidlist.length==0) { 
			return null;
		// if goal pos is null then 0
		} else if (goal_pos==null) { 
			return 0; 
		// if goal pos < 0 then 0
		} else if (goal_pos<0) { 
			return 0; 
		// if goal_pos beyond length then last pos
		} else if (goal_pos>=this.rowidlist.length) { 
			return this.rowidlist.length-1; 
		}
		// else goal pos
        else { 
			return goal_pos; 
		}
    }
	// function get_pos_exists
    this.get_pos_exists = function(pos) {
        if (this.rowidlist[pos]===undefined) {
            return false;
        }   
        return true; 
    }
	// function get_rowid_exists
    this.get_rowid_exists = function(rowid) {
        if (this.rowid2pos(rowid)==null) {
            return false;
        }
        return true; 
    }
}


// ---------------
// Class EventData
// ---------------
alat.EventData = function(event) {
	// generic alat object inheritance
    alat.AlatObject.call(this,alat.const.CLASS_EVENTDATA);
	// event object
    this.event = event;
}; 


// -----------
// Class Event
// -----------
alat.Event = function(block,callback,type,ident) {
	// generic alat object inheritance
    alat.AlatObject.call(this,alat.const.CLASS_EVENT);
	// parent block
    this.block = block;
	// callback property ( function(block,data) )
    this.callback = callback;
	// event type
    this.type = type;
	// additional ident (depends on type, optional)
    this.ident = ident; // fieldname or actionname
	// register event at block
    //this.block.eventdict[[this.type,this.ident]]=this; // TO DELETE
	// register event at event manager
    this.block.event_manager.eventdict[[this.type,this.ident]]=this;	
};


// ----------------
// Event subclasses
// ----------------
alat.ChangeEvent = function(block,callback,fieldname) { 
	alat.Event.call(this,block,callback,alat.const.EVENT_CHANGE,fieldname);
}
alat.ActionEvent = function(block,callback,actionname) { 
	alat.Event.call(this,block,callback,alat.const.EVENT_ACTION,actionname);
}
alat.RowBeforeEvent = function(block,callback) { 
	alat.Event.call(this,block,callback,alat.const.EVENT_ROW_BEFORE,null);
}
alat.RowAfterEvent = function(block,callback) { 
	alat.Event.call(this,block,callback,alat.const.EVENT_ROW_AFTER,null);
}
alat.RefreshGUIEvent = function(block,callback) { 
	alat.Event.call(this,block,callback,alat.const.EVENT_REFRESH_GUI,null);
}


// ------------------
// Class EventManager
// ------------------
alat.EventManager = function(block) {
    // generic alat object inheritance
    alat.AlatObject.call(this,alat.const.CLASS_EVENT_MANAGER);
    // parent block
    this.block = block;
	// dictionary for event registration
	this.eventdict = {};
	// execution stack property: list of Objects
	this.execution_stack = [];
    // event cb stack: list of execetution events callbacks
    this.event_cb_stack = [];
	// property last_retval
	this.last_retval = null;
    // function get_current_event_cb: returns current reg_key callback execution
    this.get_current_event_cb = function() {
        return this.event_cb_stack[this.event_cb_stack.length-1];
    }
    // function exists_event_cb(reg_key): return true if reg_key is already in execution
    this.exists_event_cb = function(reg_key) {
        return this.event_cb_stack.indexOf(reg_key)>=0;
    }
	// function get_current_level 
	this.get_current_level = function() {
		return this.execution_stack[this.execution_stack.length-1];
	}
	// function start_sequence  (umjesto set_stage)
	this.start_sequence = function(seq_type) {
		var d = new Object();
		d.seq_type = seq_type;
		d.stage = 0;
		d.data = new Object();
		this.execution_stack.push(d);
	}
	// function set_seq_stage(newstage) - for sequences (umjeto activate_stage)
	this.set_seq_stage = function(newstage) {
		var e = this.get_current_level();
		if (e!=null) {
			e.stage = newstage;
		}
	}
	// function close_level(retval) - ends current level (umjesto set_stage(null,null))
	this.close_level = function(retval) {
		var len = this.execution_stack.length;
		if (len>0) {
			this.last_retval = retval;
			this.execution_stack.pop();
		}
	}
	// function continue() - continue execution
	this.continue = function() {
		// get current level
		var e = this.get_current_level();
        var data = e.data;
		if (e != null) {
                        if (e.seq_type == alat.const.EVENT_STAGE_TYPE_GOTO_ROW) {
                                this.goto_row();
                                return;
                        }
                        if (e.seq_type == alat.const.EVENT_STAGE_TYPE_WRITE_ROW) {
                                this.write_row();
                                return;
                        }
                        if (e.seq_type == alat.const.EVENT_STAGE_TYPE_INSERT_ROW) {
                                this.insert_row();
                                return;
                        }
                        if (e.seq_type == alat.const.EVENT_STAGE_TYPE_DELETE_ROW) {
                                this.delete_row();
                                return;
                        }
                        if (e.seq_type == alat.const.EVENT_STAGE_TYPE_PUT) {
                                this.put();
                                return;
                        }
                        if (e.seq_type == alat.const.EVENT_STAGE_TYPE_SET) {
                                this.set();
                                return;
                        }
                        if (e.seq_type == alat.const.EVENT_STAGE_TYPE_GET) {
                                this.get();
                                return;
                        }
                        if (e.seq_type == alat.const.EVENT_STAGE_TYPE_CLOSE_BLOCK) {
                                this.close_block();
                                return;
                        }
		}
	}		
    // function continue_event: in callbeack function after child block - intended for stage continuity
    this.continue_event = function(retval) {
		// get current level
		var e = this.get_current_level();
		if (e != null) {
            var data = e.data;
			if (retval==false) {
				// cleanup delete row
				if (e.seq_type == alat.const.EVENT_STAGE_TYPE_DELETE_ROW) {
					this.block.buffer.rowdict[this.block.buffer.rowid].status = data.first_row_status;
				}	
				this.close_level(false);
				this.block.refresh_gui();
				return false;
			}
			this.continue();
		}
	}
	
	// function has_event: true if event is registered
    this.has_event = function(type,ident) {
        var event = this.eventdict[[type,ident]];
        if (event==null) { 
			return false; 
		}
        return true;        
    }		
	// function call_event: execute event code
    this.call_event = function(type,ident,arg1,arg2) {
        // event methods can return true,false values - success or fail indicator
		// find event in event registration
        var event = this.eventdict[[type,ident]];
        // retval - return value
        var retval = true;
		// if registered
        if (event!=null) {
			// create EventData object and apply data values according to event type
            var data = new alat.EventData(event);
            if (type==alat.const.EVENT_CHANGE) {
                data.oldvalue = arg1;
                data.newvalue = arg2;
            }
            /* -SETGET-
            if (type==alat.const.EVENT_SET) {
                data.value = arg1;
            }
            if (type==alat.const.EVENT_GET) {
                data.value = arg1;
            }
            */
            if (type==alat.const.EVENT_ACTION) {
                data.datadict = arg1;
            }			
			// if event is ROW_AFTER
            if (type==alat.const.EVENT_ROW_AFTER) {
				// if rowid is null return true
                if (this.block.buffer.rowid==null) {
					return true
				}
            }
			// call event code
            if (event.callback==null) {
                // callback does not exists
                retval=true;
            } else {
                var reg_key = type+'-'+ident;
                // Recursion check for SET and GET events
                if (this.exists_event_cb(reg_key)) {
                    return false;
                } 
                this.event_cb_stack.push(reg_key);
                // callback exists
                retval = event.callback(this.block,data);
                this.event_cb_stack.pop();
                // if not current block and not in sub callbac list
                if (this.block.is_current()==false && alat.const.EVENT_SUB_CALLBLOCK.indexOf(type)==-1) {
                    var errmsg = "Error! Sub CallBlock not allowed for: "+reg_key;
                    alert(errmsg);
                    return false;
                }
            }
        }
        // Row after has to return true or false only
        if (type==alat.const.EVENT_ROW_AFTER  && this.block.buffer.rowid!=null) {
            if (retval!=false) {
                return true;
            }
            return false;
        }	
		// success by default if not exists
        return retval;
    }
	// function goto_row: jump to specified rowid + firing events
        // if false: unable to jump
    this.goto_row = function(rowid,relpos) {
		var e = this.get_current_level();
		var data = e.data;
		if (e.stage==0) {
			// saving initial param values
			data.rowid = rowid;
			data.relpos = relpos;
			data.new_pos = this.block.buffer.rowid2pos(data.rowid)+alat.lib.nvl(data.relpos,0);
			data.new_rowid = this.block.buffer.pos2rowid(data.new_pos);
			data.old_rowid = this.block.buffer.rowid;
			// if same rowid - don't jump
			if (data.new_rowid==data.old_rowid) {
				this.close_level(null);
				return;
			}
			// if new rowid doesn't exist - don't jump
			if (this.block.buffer.get_rowid_exists(data.new_rowid)==false) {
				this.close_level(null);
				this.block.refresh_gui();
				return;
			}
			// continue to next stage
			e.stage = 1;
		}
		if (e.stage==1) {
			// if row is inserted and not changed - delete it
			if (this.block.buffer.empty_inserted_row(data.old_rowid)) {
				this.block.buffer.write_changedict();
				this.block.buffer.delete_row();
				// new position
				this.block.buffer.rowid = data.new_rowid;
				this.block.call_event(alat.const.EVENT_ROW_BEFORE); // always enters - ignoring result
				// clear stage and return
				this.close_level(null);
				this.block.refresh_gui();
				return;
			}
			// else activate stage 2
			e.stage = 2;
		}
		if (e.stage==2) {
			// if row after event fails - don't jump
			// call row_after event
			data.ra_retval = this.block.call_event(alat.const.EVENT_ROW_AFTER);
			//alert("current after row after:"+this.block.is_current());
			// if this block is current
			if (this.block.is_current()) {
				// if return value is false
				if (data.ra_retval==false) {
					this.close_level(false);
					this.block.refresh_gui();
					return;
				}
				//alert("current block i goto stage 3");
				// otherwise activate stage 3 and continue
				e.stage = 3;
			} else {
			// else if block is not current activate stage 3 but return
				//alert("not current block");
				e.stage = 3;
				return;
			}
		}
		if (e.stage==3) {
			// if rowid is not null then row status is update (after succesfull ROW_AFTER
			if (this.block.buffer.rowid!=null) {
				this.block.buffer.rowdict[this.block.buffer.rowid].status = alat.const.ROWSTATUS_UPDATE;
			}		
			// write changes in old_rowid
			this.block.buffer.write_changedict();
			// new position
			this.block.buffer.rowid = data.new_rowid;
			this.block.call_event(alat.const.EVENT_ROW_BEFORE); // always enters - ignoring result
			// clear stage and return true
			this.close_level(null);
			this.block.refresh_gui();
			return;
		}
    }
    // function write_row: triggers row_after event and call callback if succesfull
    this.write_row = function(callback) {
        var e = this.get_current_level();
        var data = e.data;
        if (e.stage==0) {
            // saving initial param values
            data.callback = callback;
            // call row_after event
            data.ra_retval = this.block.call_event(alat.const.EVENT_ROW_AFTER);
            // if this block is current
            if (this.block.is_current()) {
                // if return value is false
                if (data.ra_retval==false) {
                    this.close_level(false);
                    this.block.refresh_gui();
                    return false;
                }
                // otherwise activate stage 1 and continue
                e.stage = 1;
            } else {
            // else if block is not current activate stage 1 but return
                e.stage = 1;
                return;
            }
        }
        if (e.stage==1) {
            // if rowid is not null then row status is update (after succesfull ROW_AFTER)
            if (this.block.buffer.rowid!=null) {
                this.block.buffer.rowdict[this.block.buffer.rowid].status = alat.const.ROWSTATUS_UPDATE;
            }       
            // write changes in old_rowid
            this.block.buffer.write_changedict();
            // clear stage and return true
            this.close_level(true);
            this.block.refresh_gui();
            // call callback function
            if (data.callback != null) {
                retval = data.callback(this.block,null);
            }
            return;
        }
    }        
	// function delete row: delete row with events
    this.delete_row = function() {
		var e = this.get_current_level();
		var data = e.data;
		if (e.stage==0) {
			data.first_row_status = this.block.buffer.rowdict[this.block.buffer.rowid].status;
			if (this.block.buffer.rowdict[this.block.buffer.rowid].status == alat.const.ROWSTATUS_UPDATE) {;
				// set row status to delete
				this.block.buffer.rowdict[this.block.buffer.rowid].status = alat.const.ROWSTATUS_DELETE;
				// call row after event
				data.ra_retval = this.block.call_event(alat.const.EVENT_ROW_AFTER);
				if (this.block.is_current()) {
					// if return value is false
					if (data.ra_retval==false) {
						// old row status
						this.block.buffer.rowdict[this.block.buffer.rowid].status = data.first_row_status;
						// stage = null
						this.close_level(false);
						this.block.refresh_gui();
						return;
					}
					//alert("current block i goto stage 1");
					// otherwise activate stage 1 and continue
					e.stage = 1;
				} else {
				// else if block is not current activate stage 1 but return
					//alert("not current block");
					e.stage = 1;
					return;
				}
			} else {
				// rowstatus is not update: it should be removed without row after event -> stage 1
				e.stage = 1;
			}
		}
		if (e.stage==1) {
			// write changedict
			this.block.buffer.write_changedict();
			// calc new position
			data.delpos = this.block.buffer.rowid2pos(this.block.buffer.rowid);
			data.new_rowid = null;
			if (data.delpos<this.block.buffer.get_last_pos()) {
				data.new_rowid=this.block.buffer.pos2rowid(data.delpos+1);
			}
			else if (data.delpos>0) {
				data.new_rowid=this.block.buffer.pos2rowid(data.delpos-1);
			}
			// delete row from buffer
			this.block.buffer.delete_row();
			// position to new rowid
			this.block.buffer.rowid = data.new_rowid;
			// focus first
			this.block.gui_manager.focus_first();
			// fire row before event - ignore result 
			this.block.call_event(alat.const.EVENT_ROW_BEFORE);
			// clear stage and return
			this.close_level(null);
			this.block.refresh_gui();
			return;
		}
    }
	// function insert_row: insert row with events
    this.insert_row = function() {
		var e = this.get_current_level();
		var data = e.data;
		//alert("goto row "+rowid+' '+relpos+' '+this.active_stage);
		if (e.stage==0) {
			data.first_row_status = this.block.get_row_status();
			// if current rowid is not null
			if (this.block.buffer.rowid!=null) {
				// if there is no changedict and current rowid status is insert then exit
				if (this.block.buffer.empty_inserted_row(this.block.buffer.rowid)) {
					this.close_level(null);
					this.block.refresh_gui();
					return;
				}
			}
			// call event row_after
			data.ra_retval = this.block.call_event(alat.const.EVENT_ROW_AFTER);
			if (this.block.is_current()) {
				// if return value is false
				if (data.ra_retval==false) {
					// stage = null
					this.close_level(false);
					this.block.refresh_gui();
					return;
				}
				//alert("current block i goto stage 1");
				// otherwise activate stage 1 and continue
				e.stage = 1;
			} else {
			// else if block is not current activate stage 1 but return
				//alert("not current block");
				e.stage = 1;
				return;
			}
		}
		if (e.stage==1) {
			// if rowid is not null then row status is update (after succesfull ROW_AFTER
			if (this.block.buffer.rowid!=null) {
				this.block.buffer.rowdict[this.block.buffer.rowid].status = alat.const.ROWSTATUS_UPDATE;
			}		
			// write changes
            this.block.buffer.write_changedict();
			// insert buffer row after current rowid
            this.block.buffer.insert_row(this.block.buffer.rowid); // insert after
			// new rowid status is insert
            this.block.buffer.rowdict[this.block.buffer.rowid].status = alat.const.ROWSTATUS_INSERT;
            // init recalc - multivalue fields for new row
            for (var x in this.block.buffer.multiposdict) {
                var f = this.block.buffer.fielddict[x];
                // if init expression exist
                if (f.init != null) {
                    this.block.buffer.set_recalc(x,this.block.expr(f.init)); 
                }
            }
            // focus first
            this.block.gui_manager.focus_first();
			// call row before
            this.block.call_event(alat.const.EVENT_ROW_BEFORE);            
			// clear stage and return
			this.close_level(null);
			this.block.refresh_gui();
			return;
		}
    }    
	// function put: put value directly to buffer without calling change event 
	this.put = function(fieldname,newvalue) {
        var e = this.get_current_level();
        var data = e.data;
        if (e.stage==0) {
            // saving initial param values
            data.fieldname = fieldname;
            data.newvalue = newvalue;
            // if rowid is null and fieldname is column then exit
            if (this.block.buffer.rowid == null && this.buffer.fielddict[data.fieldname].is_column ) {
                this.close_level();
                this.block.refresh_gui();
                return;
            }
            data.newvalue2 = data.newvalue;
            // call buffer set with newvalue2
            this.block.buffer.set(data.fieldname,data.newvalue2);
            // delete from recalcdict
            delete this.block.buffer.recalcdict[data.fieldname];
            // delete from changedict
            delete this.block.buffer.changedict[data.fieldname];
            // exit
            this.close_level();
            this.block.refresh_gui();
        }
    }    
    // function set: set value of field as the result of user input (with events, recalculation etc.)
    this.set = function(fieldname,newvalue) {
        var e = this.get_current_level();
        var data = e.data;
        if (e.stage==0) {
            // saving initial param values
            data.fieldname = fieldname;
            data.newvalue = newvalue;
            data.field = this.block.buffer.fielddict[data.fieldname];
            // if rowid is null and fieldname is column then exit
            if (this.block.buffer.rowid == null && this.block.buffer.fielddict[data.fieldname].is_column ) {
                this.close_level();
                this.block.refresh_gui();
                return;
            }
            data.newvalue2 = data.field.string2datatype(data.newvalue);
            // get old field value
            data.oldvalue = this.block.get(data.fieldname);
            //alat.lib.log("Breakpoint:"+data.oldvalue+"->"+data.newvalue2);
            // if new value is different than old value and new value is not undefined
            if (data.oldvalue !== data.newvalue2 && data.newvalue2 !== undefined) {
                data.ch_retval = this.block.call_event(alat.const.EVENT_CHANGE,data.fieldname,data.oldvalue,data.newvalue2);
                // if this block is still current
                if (this.block.is_current()) {
                    // if return value is false
                    if (data.ch_retval==false) {
                        // exit and close level
                        this.close_level();
                        this.block.refresh_gui();
                        return;
                    }
                    e.stage = 1;
                } else {
                    // this block is not current
                    e.stage=1;
                    return;
                }
            }
            if (e.stage==0) {
                e.stage = 2;
            }
        }
        if (e.stage==1) {
            // store changed value if same value is not in recalcdict
            if (this.block.buffer.recalcdict[data.fieldname]===undefined || this.block.buffer.recalcdict[data.fieldname]!=data.newvalue2) {
                // store changed value
                this.block.buffer.set_change(data.fieldname,data.newvalue2);
                // recalc process starting from field
                this.block.buffer.recalc_walk(data.fieldname);
            }
            e.stage = 2;
        }
        if (e.stage==2) {
            // exit
            this.close_level();
            this.block.refresh_gui();
        }
    }
    // function get: get value of field (with recalc, change, events etc...) 
    this.get = function(fieldname,rowid) {
        var e = this.get_current_level();
        var data = e.data;
        if (e.stage==0) {
            // saving initial param values
            data.fieldname = fieldname;
            data.rowid = rowid;
            // init retval
            data.retval = null;
            // if rowid parameter is null or current rowid
            if (data.rowid==null || data.rowid==this.block.buffer.rowid) {
                // if field is not in changedict
                if (this.block.buffer.changedict[data.fieldname]===undefined) {
                    // if field is not in recalcdict
                    if (this.block.buffer.recalcdict[data.fieldname]===undefined) {
                        // retval is buffer storage value
                        data.retval = this.block.buffer.get(data.fieldname);
                    // else get value from recalcdict
                    } else {
                        data.retval = this.block.buffer.get_recalc(data.fieldname);
                    }    
                // else get value from changedict
                } else {
                    data.retval = this.block.buffer.get_change(data.fieldname);
                }
            // else retval is buffer storage value
            } else {
                data.retval = this.block.buffer.get(data.fieldname,data.rowid);            
            }
            // return retval
            this.close_level(data.retval);
            //this.block.refresh_gui();  // problem - recursion
            return data.retval;
        }
    }    
    // function close_block: triggers row_after event and close block if succesfull
    this.close_block = function() {
        var e = this.get_current_level();
        var data = e.data;
        if (e.stage==0) {
            // call row_after event
            data.ra_retval = this.block.call_event(alat.const.EVENT_ROW_AFTER);
            // if this block is current
            if (this.block.is_current()) {
                // if return value is false
                if (data.ra_retval==false) {
                    this.close_level(false);
                    this.block.refresh_gui();
                    return false;
                }
                // otherwise activate stage 1 and continue
                e.stage = 1;
            } else {
            // else if block is not current activate stage 1 but return
                e.stage = 1;
                return;
            }
        }
        if (e.stage==1) {
            // if rowid is not null then row status is update (after succesfull ROW_AFTER)
            if (this.block.buffer.rowid!=null) {
                this.block.buffer.rowdict[this.block.buffer.rowid].status = alat.const.ROWSTATUS_UPDATE;
            }       
            // write changes in old_rowid
            this.block.buffer.write_changedict();
            // clear stage and return true
            this.close_level(true);
            this.block.refresh_gui();
            // close block
            //alert("Closing block..."+this.block);
            alat.manager.close_block(this.block);
            return;
        }
    }        
}


// ----------------
// Class KeyHandler
// ----------------
alat.KeyHandler = function(parent_class) {
    // generic alat object inheritance
    alat.AlatObject.call(this,alat.const.CLASS_KEY_HANDLER);
    // parent
    this.parent = parent_class;
    // keydict [keycode,mod] = target;
    this.keydict = {};
    // function calc_ascm_code: calc code from alt+shift+ctrl+meta combination
    this.calc_ascm_code = function(alt,shift,ctrl,meta) {
        var r = "";
        if (alt) r += 'a';
        if (shift) r += 's';
        if (ctrl) r += 'c';
        if (meta) r += 'm';
        return r;
    }
    // function calc_key_mod: calculate key mod
    this.calc_key_mod = function(mod) {
        var s = alat.lib.nvl(mod,"").toLowerCase();
        var alt = s.indexOf('a') != -1;
        var shift = s.indexOf('s') != -1;
        var ctrl = s.indexOf('c') != -1;
        var meta = s.indexOf('m') != -1;
        return this.calc_ascm_code(alt,shift,ctrl,meta);
    }
    // function set_key_event: sets key event for keycode + mod string
    this.set_key_event = function(keycode,mod,target) {
        var m = this.calc_key_mod(mod);
        if (target!=null) {
            this.keydict[[keycode,m]] = target;
        } else {
            delete this.keydict[[keycode,m]];
        }            
    }
    // function get_key_event
    this.get_key_event = function(keycode,mod) {
        var m = this.calc_key_mod(mod);
        return this.keydict[[keycode,m]];
    }
}

// -----------
// Class Block
// -----------
alat.Block = function(paramdict,callback) {
    // generic alat object inheritance
    alat.AlatObject.call(this,alat.const.CLASS_BLOCK); 
    // create buffer
    this.buffer = new alat.Buffer(this);
    // create event manager
    this.event_manager = new alat.EventManager(this);
    // create key KeyHandler
    this.key_handler = new alat.KeyHandler(this);
    // private block variable (for expression evaluation)
    var block = this;
	// parent block property (caller)
	this.parent = null;
	// parameter dictionary
	this.paramdict = alat.lib.nvl(paramdict,{});
    // callback parameter
    this.callback = callback;
	// allow_insert: can be expression
	this.allow_insert = true;
	// allow_delete: can be expression
	this.allow_delete = true;
	// gui manager property
	this.gui_manager = null;
    // function set_key_event
    this.set_key_event = function(keycode,mod,target) {
        this.key_handler.set_key_event(keycode,mod,target);
    }
    // function get_key_event
    this.get_key_event = function(keycode,mod) {
        var t = this.key_handler.get_key_event(keycode,mod);
        if (t == null) {
            // if no handler get from manager object
            t = alat.manager.get_key_event(keycode,mod);
        }
        return t;
    }
    // function eval: evaluation of string expression
    this.eval = function(expr_string) {
        return eval(expr_string);
    }
    // function expr: if object is function then evaluate object else return object itself
    this.expr = function (object,additional_data) {
		if (object==null) {
			return object;
		}
		if (typeof(object) == "function") {
			return object(this,additional_data);
		}
        return object;
    }
	// evaluation accoording to calc mode
    this.calc_eval = function(value) { 
        if (alat.manager.calc_mode) {
            return eval(value);
        };
        return value;
    };    
	// function info
	this.info = function () {
		return "Row status:"+this.get_row_status()+" Rowid:"+this.buffer.rowid+" RowCount:"+this.count_rows()+" Changed:"+this.is_changed();
	}
	// function count_rows: return number of rows in buffer
	this.count_rows = function() {
        return this.buffer.rowidlist.length;
    }
	// function put: put value directly to buffer without calling change event (but call set event)
	this.put = function(fieldname,newvalue) {
        this.event_manager.start_sequence(alat.const.EVENT_STAGE_TYPE_PUT);
		this.event_manager.put(fieldname,newvalue);
	}
    // function set: set value of field as the result of user input (with events, recalculation etc.)
    this.set = function(fieldname,newvalue) {
        this.event_manager.start_sequence(alat.const.EVENT_STAGE_TYPE_SET);
		this.event_manager.set(fieldname,newvalue);
    }
    // function get: get value of field (with recalc, change, events etc...) 
    this.get = function(fieldname,rowid) {
        this.event_manager.start_sequence(alat.const.EVENT_STAGE_TYPE_GET);
		return this.event_manager.get(fieldname,rowid);
    }
    // function gui_put
    this.gui_put = function(fieldname,newvalue) {
        return this.put(fieldname,newvalue);
    }
    // function gui_get
    this.gui_get = function(fieldname,newvalue) {
        var v = this.get(fieldname,newvalue);
        var f = this.buffer.fielddict[fieldname];
        return f.datatype2string(v);
    }
    // function gui_set
    this.gui_set = function(fieldname,newvalue) {
        return this.set(fieldname,newvalue);
    }
    // function server_put
    this.server_put = function(fieldname,newvalue) {
        var f = this.buffer.fielddict[fieldname];
        var v = f.server2datatype(newvalue);
        return this.put(fieldname,v);
    }
    // function server_get
    this.server_get = function(fieldname,newvalue) {
        var v = this.get(fieldname,newvalue);
        var f = this.buffer.fielddict[fieldname];
        return f.datatype2server(v);
    }
    // function server_set
    this.server_set = function(fieldname,newvalue) {
        var f = this.buffer.fielddict[fieldname];
        var v = f.server2datatype(newvalue);
        return this.set(fieldname,v);
    }
	// function is_current: return true if this block is current false otherwise
	this.is_current = function() {
		return alat.manager.current_block()===this;
	}
	// function is_changed: return true if there is any change in variables (buffer changedict)
	this.is_changed = function() {
        return alat.lib.keys(this.buffer.changedict).length>0;
    }
	// function call_event: execute event code
    this.call_event = function(type,ident,arg1,arg2) {
		return this.event_manager.call_event(type,ident,arg1,arg2);
    }	
    // function action: execute action
    this.action = function(actionname,datadict) {
		if (actionname!=null) {
			this.call_event(alat.const.EVENT_ACTION,actionname,datadict);
		}
    };    
	// function refresh_gui: refresh all gui elements attached to block
	// 		calling gui_manager refresh_all() function
    this.refresh_gui = function() {
		if (this.gui_manager!=null) {
			this.gui_manager.refresh_all();
            // after refresh call refresh GUI event if gui is drawn
            if (this.gui_manager.drawn) {
                this.call_event(alat.const.EVENT_REFRESH_GUI);
            }
		}
    }
	// function draw_gui: draw all gui elements attached to block
	// 		calling gui_manager draw_all() function
    this.draw_gui = function() {
		if (this.gui_manager!=null) {
			this.gui_manager.draw_all();
		}
    }
    // function clear_gui: clear all gui elements attached to block
    //      calling gui_manager clear_all() function
    this.clear_gui = function() {
        if (this.gui_manager!=null) {
            this.gui_manager.clear_all();
        }
    }
	// function goto_row_force:
    this.goto_row_force = function(rowid,relpos) {
        var pos = this.buffer.rowid2pos(rowid);
		// jump to first if out of boundaries
        if (pos+alat.lib.nvl(relpos,0)<0) {
            return this.goto_row(rowid,-pos);
        }
		// jump to last if out of boundaries
        if (pos+alat.lib.nvl(relpos,0)>this.buffer.get_last_pos()) {
            return this.goto_row(rowid,this.buffer.get_last_pos()-pos);
        }
		// if in boundaries jump where specified
        return this.goto_row(rowid,alat.lib.nvl(relpos,0));
    }
	// function goto_row: jump to specified rowid + firing events
	// if false: unable to jump
    this.goto_row = function(rowid,relpos) {
		//alert("call from block.goto_row");
        this.event_manager.start_sequence(alat.const.EVENT_STAGE_TYPE_GOTO_ROW);
		return this.event_manager.goto_row(rowid,relpos);
    }
	// function delete row: delete row with events
    this.delete_row = function() {
		if (this.expr(this.allow_delete)) {
			this.event_manager.start_sequence(alat.const.EVENT_STAGE_TYPE_DELETE_ROW);
			return this.event_manager.delete_row();
		}
    };
	// function insert_row: insert row with events
    this.insert_row = function() {
		if (this.expr(this.allow_insert)) {
			this.event_manager.start_sequence(alat.const.EVENT_STAGE_TYPE_INSERT_ROW);
			return this.event_manager.insert_row();
		}
    }
    // function write_row: calls ROW AFTER and if true execute callback
    this.write_row = function(callback) {
        this.event_manager.start_sequence(alat.const.EVENT_STAGE_TYPE_WRITE_ROW);
        return this.event_manager.write_row(callback);
    }
    // function close_block
    this.close_block = function() {
        this.event_manager.start_sequence(alat.const.EVENT_STAGE_TYPE_CLOSE_BLOCK);
        return this.event_manager.close_block();
        //alat.manager.close_block(this);
    }
	// function populate_all: refresh data feched from database
	this.populate_all = function(datadict) {
		this.buffer.rowdict = {};
		this.rowidlist = [];
		this.buffer.rowid = null;
		this.buffer.rowid_counter = 0;
		var header = datadict["header"];
		var data = datadict["data"];
		for (var j=0;j<data.length;j++) {
			this.buffer.insert_row();
			for (var i=0;i<header.length;i++) {
                if (this.buffer.fielddict[header[i]]) {
                    this.buffer.server_set(header[i],data[j][i]);
                }
			}
		}
		this.refresh_gui();
	}
	// function populate_row: populate current row with fetched data
	this.populate_row = function(rowdict) {
		for (var name in rowdict) {
			this.buffer.set(name,rowdict[name]);
		}
		this.refresh_gui();
	}	
	// function get_row_status
    this.get_row_status = function() {
        if (this.buffer.rowid!=null) {
            return this.buffer.rowdict[this.buffer.rowid].status;
        } else {
            return null;
        }
    }
	// function call_block
    this.call_block = function(blockname,callback,data,autofields) {
		alat.manager.call_block(blockname,this.data_dict("call",data,autofields),callback);
	}
	// function call_server
	this.call_server = function(callback_name,callname,data,autofields) {
		var retval = alat.manager.call_server(this,callback_name,this.data_dict(callname,data,autofields));
        return retval;
	}
    // function data_dict: form data dict for block and server calls
    this.data_dict = function(callname,paramdict,autofields) {
        var v_retdict = {};
        var v_blockdict = {};
        var v_paramdict = alat.lib.nvl(paramdict,{});
        // session id
        v_blockdict["session_id"]=alat.manager.session_id;
        // rowid
        v_blockdict["rowid"] = this.buffer.rowid;
        // row status
        v_blockdict["status"]=this.get_row_status();
        // row count
        v_blockdict["row_count"]=this.buffer.rowdict.length;
		// if autofields is set to true then all fields are transfered
		if (autofields==true) {
			for (var fname in this.buffer.fielddict) {
				v_paramdict[fname]=this.server_get(fname);
			}
		} 
        v_retdict = {callname:callname,block:v_blockdict,param:v_paramdict};
        return v_retdict;
    }
}


// -------------
// Class Manager
// -------------
alat.Manager = function() {
    // generic alat object inheritance
    alat.AlatObject.call(this,alat.const.CLASS_MANAGER); 
    // session_id
    this.session_id = null;
    // id counter for html tags
    this.id_counter = 1; 
    // calculation mode
    this.calc_mode = false; 
    // stack of block objects    
    this.block_stack = []; 
    // create key KeyHandler
    this.key_handler = new alat.KeyHandler(this);
    // function new_id: html tag id construction
    this.new_id = function() { 
    	var id = 'id'+this.id_counter;
    	this.id_counter = this.id_counter + 1;
    	return(id);
    }
    // function set_key_event
    this.set_key_event = function(keycode,mod,target) {
        this.key_handler.set_key_event(keycode,mod,target);
    }
    // function get_key_event
    this.get_key_event = function(keycode,mod) {
        return this.key_handler.get_key_event(keycode,mod);
    }
    // function reopen_block: reopen existing block
    this.reopen_block = function(block_object) {
        block_object.draw_gui();
        block_object.refresh_gui();
        b = block_object; // TEMPORARY FOR TESTING
    }
    // function open_block: adds block
    this.open_block = function(block_object) {
		var parent = this.current_block();
        this.block_stack.push(block_object);
		block_object.parent = parent;
		block_object.draw_gui();
		block_object.refresh_gui();
		b = block_object; // TEMPORARY FOR TESTING
    }
	// function close_block: close current block, and open previous one
	this.close_block = function() {
		var block = this.current_block();
		if (block!=null) {
            block.clear_gui();
			this.block_stack.pop();
			var next_block = this.current_block();
			if (next_block!=null) {
				this.reopen_block(next_block);
				//next_block.event_manager.refresh_stage();
                // callback execution of child block on parent block
                if (block.callback!=null) {
                    var retval = null;
					/*
                    if (block.callback.className==alat.const.CLASS_EXPRESSION) {
                        retval = next_block.expr(block.callback);
                    } else {
                        retval = block.callback(next_block);
                    }
					*/
					retval = block.callback(next_block);
                    next_block.event_manager.continue_event(retval)
                }
			}
		}
	}
    // function current_block: returns current block (last in stack), undefined if there is no block
    this.current_block = function() {
        return this.block_stack[this.block_stack.length-1];
    }
    // function call: new block call
    this.call_block = function(blockname,data,callback) { 
        // fetch new block and start it with parameters in param_list
    }
    // function ajax: ajax call to server
    this.call_server = function(block,callback_name,data) { 
        // server call - sending variable data and returns javascript code
    }
}
// create manager instance within namespace
// methods overriding by server-specific .js library
alat.manager = new alat.Manager(); 
