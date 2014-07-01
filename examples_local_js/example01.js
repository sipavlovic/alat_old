alat.local.server.blocks["CustomerBlock"] = function(paramdict,callback) {
    alat.local.Block.call(this,paramdict,callback);
    // DATA
    this.vars = Object();
    this.vars.customer_id = new alat.Integer(this,"CUSTOMER_ID").column();
        this.vars.customer_id.readonly = function(block,data) { return block.get_row_status()!=alat.const.ROWSTATUS_INSERT; }
    this.vars.first_name = new alat.String(this,"FIRST_NAME").column();
    this.vars.last_name = new alat.String(this,"LAST_NAME").column();
    this.vars.amount = new alat.Float(this,"AMOUNT").column();
        this.vars.amount.readonly = true;
		this.vars.amount.set_action("DETAILS");
    this.vars.address = new alat.String(this,"ADDRESS").column();
    this.vars.city = new alat.String(this,"CITY").column();
    this.vars.country = new alat.String(this,"COUNTRY").column();
    this.vars.email = new alat.String(this,"EMAIL").column();
    this.vars.vip = new alat.Boolean(this,"VIP").column();
    this.vars.date = new alat.Datetime(this,"DATE").column();
    this.vars.return_value = new alat.String(this,"RETURN_VALUE").variable();
        this.vars.return_value.readonly = true;
    // GUI
    this.gui = Object();
	this.gui.manager = new alat.gui.classic.Manager(this);
	this.gui.panel = new alat.gui.classic.Window(this.gui.manager); 
		this.gui.panel.pos("30px","30px");
		this.gui.panel.size("800px","340px");
        this.gui.panel.close_button.hidden = true;
	this.gui.table = new alat.gui.classic.Table(this.gui.panel,10);
		this.gui.table.add_column("CUSTOMER_ID","Customer Id");
		this.gui.table.add_column("FIRST_NAME","First name");
		this.gui.table.add_column("LAST_NAME","Last name");
		this.gui.table.add_column("AMOUNT","Amount");		
		this.gui.table.add_column("ADDRESS","Address");
		this.gui.table.add_column("CITY","City");
		this.gui.table.add_column("COUNTRY","Country");
        this.gui.table.add_column("VIP","Vip");        
        this.gui.table.add_column("DATE","Date");        
        this.gui.table.add_column("EMAIL","e-mail");        
        this.gui.table.gpos(1,1);
    this.gui.title = new alat.gui.classic.Title(this.gui.panel,'- CUSTOMERS -',this.gui.panel); this.gui.title.gpos(35,0);    
    var p1 = 43; var p2 = 52;
	this.gui.l1 = new alat.gui.classic.Label(this.gui.panel,'Customer id:'); this.gui.l1.gpos(p1,1.2);
	this.gui.e1 = new alat.gui.classic.Edit(this.gui.panel,"CUSTOMER_ID"); this.gui.e1.gpos(p2,1);
	this.gui.l2 = new alat.gui.classic.Label(this.gui.panel,'First Name:'); this.gui.l2.gpos(p1,2.2);
	this.gui.e2 = new alat.gui.classic.Edit(this.gui.panel,"FIRST_NAME"); this.gui.e2.gpos(p2,2);
	this.gui.l3 = new alat.gui.classic.Label(this.gui.panel,'Last Name:'); this.gui.l3.gpos(p1,3.2);
	this.gui.e3 = new alat.gui.classic.Edit(this.gui.panel,"LAST_NAME"); this.gui.e3.gpos(p2,3);
	this.gui.l4 = new alat.gui.classic.Label(this.gui.panel,'Amount:'); this.gui.l4.gpos(p1,4.2);
	this.gui.e4 = new alat.gui.classic.Edit(this.gui.panel,"AMOUNT"); this.gui.e4.gpos(p2,4);
	this.gui.l5 = new alat.gui.classic.Label(this.gui.panel,'Address:'); this.gui.l5.gpos(p1,5.2);
	this.gui.e5 = new alat.gui.classic.Edit(this.gui.panel,"ADDRESS"); this.gui.e5.gpos(p2,5);
	this.gui.l6 = new alat.gui.classic.Label(this.gui.panel,'City:'); this.gui.l6.gpos(p1,6.2);
	this.gui.e6 = new alat.gui.classic.Edit(this.gui.panel,"CITY"); this.gui.e6.gpos(p2,6);
	this.gui.l7 = new alat.gui.classic.Label(this.gui.panel,'Country:'); this.gui.l7.gpos(p1,7.2);
	this.gui.e7 = new alat.gui.classic.Edit(this.gui.panel,"COUNTRY"); this.gui.e7.gpos(p2,7);
    this.gui.l8 = new alat.gui.classic.Label(this.gui.panel,'Vip:'); this.gui.l8.gpos(p1,8.2);
    this.gui.e8 = new alat.gui.classic.Edit(this.gui.panel,"VIP"); this.gui.e8.gpos(p2,8);
    this.gui.l9 = new alat.gui.classic.Label(this.gui.panel,'Date:'); this.gui.l9.gpos(p1,9.2);
    this.gui.e9 = new alat.gui.classic.Edit(this.gui.panel,"DATE"); this.gui.e9.gpos(p2,9);
	this.gui.l10 = new alat.gui.classic.Label(this.gui.panel,'e-mail:'); this.gui.l10.gpos(p1,10.2);
	this.gui.e10 = new alat.gui.classic.Edit(this.gui.panel,"EMAIL"); this.gui.e10.gpos(p2,10);
	this.gui.llog2 = new alat.gui.classic.Label(this.gui.panel,function (block,data) { return block.info(); }); 
		this.gui.llog2.gpos(1,11);	
    this.gui.but1 = new alat.gui.classic.Button(this.gui.panel,"Insert Row","INSERT_ROW"); this.gui.but1.gpos(1,12);
    this.gui.but2 = new alat.gui.classic.Button(this.gui.panel,"Delete Row","DELETE_ROW"); this.gui.but2.gpos(10,12);
    this.gui.but3 = new alat.gui.classic.Button(this.gui.panel,"Details","DETAILS"); this.gui.but3.gpos(21,12);
    this.gui.but4 = new alat.gui.classic.Button(this.gui.panel,"Matrix Report","MATRIX_REPORT"); this.gui.but4.gpos(28,12);
    this.gui.but5 = new alat.gui.classic.Button(this.gui.panel,"Matrix Generated Report","MATRIX_GENERATED_REPORT"); this.gui.but5.gpos(39,12);
    // EVENTS
    this.evt = Object();
    this.evt.row_after = new alat.RowAfterEvent(this,function(b,d) {
		if (b.get_row_status()!=alat.const.ROWSTATUS_UPDATE) {
			var cb = function(b,d) {
				if (b.get("RETURN_VALUE")=="YES") {
                    return b.call_server("CustomerBlock","row_after",{},true);
                }
                return false;
			}
			b.call_block("ConfirmBlock",cb,{message:"Confirm action "+b.get_row_status()+"?"});
		} else {
            b.call_server("CustomerBlock","row_after",{},true);
		}
	});
    this.evt.action_ins = new alat.ActionEvent(this,function (block,data) { return block.insert_row(); },"INSERT_ROW");
    this.evt.action_del = new alat.ActionEvent(this,function (block,data) { return block.delete_row(); },"DELETE_ROW");
    this.evt.action_details = new alat.ActionEvent(this,function(b,d) {
        master_cb = function(b,d) {
            cb = function(b,d) {
                b.call_server("CustomerBlock","amount",{},true);
            }
			//document.body.style["cursor"]="wait";
            b.call_block("CustomerDetailBlock",cb,{},true);
        }
        b.write_row(master_cb);
	},"DETAILS");
    this.set_key_event(68,"a",function(b,d) {alert("Alt+D key event demo."); b.action("DETAILS");} );
    this.evt.action_matrix_report = new alat.ActionEvent(this,function(b,d) {
        master_cb = function(b,d) {
            b.call_block("MatrixReportBlock");
        }
        b.write_row(master_cb);
    },"MATRIX_REPORT");
    this.evt.action_matrix_generated_report = new alat.ActionEvent(this,function(b,d) {
        master_cb = function(b,d) {
			//document.body.style["cursor"]="wait";
            b.call_block("MatrixGeneratedBlock");
        }
        b.write_row(master_cb);
    },"MATRIX_GENERATED_REPORT");
	// INITIAL
    this.draw_gui();
	this.call_server("CustomerBlock","reload",{},true);
}
alat.local.server.calls["CustomerBlock"] = function(data) {
    // Server-side code
    if (data["command"]=="reload")  {
        var t = alat.local.server.tables.customer;
		var td = alat.local.server.tables.customer_detail;        
        var tjson = t.json();
        var tdjson = td.json();
        var rez2 = SQLike.q({
            Select:['*',function(){
                            var dummy_customer_id = this.CUSTOMER_ID;
                            var dummy_res = SQLike.q({
                                Select:['|sum|','AMOUNT'],
                                From:tdjson,
                                Where:function(){
                                     return this.CUSTOMER_ID == dummy_customer_id
                                },
                            });
                            if (dummy_res.length==1) {
                                return dummy_res[0]['sum_AMOUNT'];
                            }
                            return 0;
                        },'|as|','AMOUNT'],
            From:tjson
        });
		// return values
        var d2 = t.norm(rez2);
        var s2 = alat.lib.str(d2);
        // return
        return 'block.populate_all('+s2+')';
    }
	if (data["command"]=="amount")  {
        var sum = 0;
		var td = alat.local.server.tables.customer_detail;
        var customer_id = data["param"]["CUSTOMER_ID"];
        var tdjson = td.json();
        var res = SQLike.q({
                                Select:['|sum|','AMOUNT'],
                                From:tdjson,
                                Where:function(){
                                            return this.CUSTOMER_ID == customer_id;
                                      }
                           })
        if (res.length==1) {
            sum = res[0]['sum_AMOUNT'];
        }
		return 'block.server_set("AMOUNT",'+sum+')';
	}
	if (data["command"]=="row_after") {
        var t = alat.local.server.tables.customer;
        var r = t.filter("row['CUSTOMER_ID']=="+data["param"]["CUSTOMER_ID"]);
        var k = alat.lib.keys(r);
		if (data["block"]["status"]==alat.const.ROWSTATUS_INSERT) {
            if (k.length==0) {
			t.insert_row();
			t.set("CUSTOMER_ID",data["param"]["CUSTOMER_ID"]);
			t.set("FIRST_NAME",data["param"]["FIRST_NAME"]);
			t.set("LAST_NAME",data["param"]["LAST_NAME"]);
			t.set("ADDRESS",data["param"]["ADDRESS"]);
			t.set("CITY",data["param"]["CITY"]);
			t.set("COUNTRY",data["param"]["COUNTRY"]);
			t.set("EMAIL",data["param"]["EMAIL"]);
            t.set("VIP",data["param"]["VIP"]);
			return 'true';
            }
            alert ("Customer ID already exists!");
            return 'false';
		}
		if (data["block"]["status"]==alat.const.ROWSTATUS_UPDATE) {
            if (k.length==1) { // only one found
                t.rowid = k[0]; 
                t.set("FIRST_NAME",data["param"]["FIRST_NAME"]);
                t.set("LAST_NAME",data["param"]["LAST_NAME"]);
				t.set("ADDRESS",data["param"]["ADDRESS"]);
				t.set("CITY",data["param"]["CITY"]);
				t.set("COUNTRY",data["param"]["COUNTRY"]);
				t.set("EMAIL",data["param"]["EMAIL"]);
                t.set("VIP",data["param"]["VIP"]);
                return 'true';
            }
            return 'false';
		}
		if (data["block"]["status"]==alat.const.ROWSTATUS_DELETE) {
            if (k.length==1) { // only one found
                t.rowid = k[0]; 
                t.delete_row();
                return 'true';
            }
            return 'false';
		}
        return 'true';
	}
}






// ==================================================================================================================

alat.local.server.blocks["CustomerDetailBlock"] = function(paramdict,callback) {
    alat.local.Block.call(this,paramdict,callback);
    // DATA
    this.vars = Object();
    this.vars.customer_id = new alat.Integer(this,"CUSTOMER_ID").column();
        this.vars.customer_id.readonly = true;
        this.vars.customer_id.make_init(function (block,data) { return block.paramdict['param']['CUSTOMER_ID'];});
    this.vars.order_no = new alat.Integer(this,"ORDER_NO").column();
        this.vars.order_no.readonly = function (block,data) { return block.get_row_status()!=alat.const.ROWSTATUS_INSERT; }
    this.vars.amount = new alat.Float(this,"AMOUNT").column();
    this.vars.return_value = new alat.String(this,"RETURN_VALUE").variable();
        this.vars.return_value.readonly = true;
    // GUI
    this.gui = Object();
	this.gui.manager = new alat.gui.classic.Manager(this);
	this.gui.panel = new alat.gui.classic.Window(this.gui.manager); 
		this.gui.panel.pos("100px","100px");
		this.gui.panel.size("700px","280px");
  	this.gui.table = new alat.gui.classic.Table(this.gui.panel,8); 
		this.gui.table.add_column("CUSTOMER_ID","Customer id");
		this.gui.table.add_column("ORDER_NO","Order No");
		this.gui.table.add_column("AMOUNT","Amount");		
        this.gui.table.gpos(1,1);
		this.gui.table.gwidth(30);
    this.gui.title = new alat.gui.classic.Title(this.gui.panel,'- DETAILS -',this.gui.panel); this.gui.title.gpos(30,0);    
    var p1 = 33; var p2 = 42;
	this.gui.l1 = new alat.gui.classic.Label(this.gui.panel,'Customer id:'); this.gui.l1.gpos(p1,1.2);
	this.gui.e1 = new alat.gui.classic.Edit(this.gui.panel,"CUSTOMER_ID"); this.gui.e1.gpos(p2,1);
	this.gui.l2 = new alat.gui.classic.Label(this.gui.panel,'Order No:'); this.gui.l2.gpos(p1,2.2);
	this.gui.e2 = new alat.gui.classic.Edit(this.gui.panel,"ORDER_NO"); this.gui.e2.gpos(p2,2);
	this.gui.l3 = new alat.gui.classic.Label(this.gui.panel,'Amount:'); this.gui.l3.gpos(p1,3.2);
	this.gui.e3 = new alat.gui.classic.Edit(this.gui.panel,"AMOUNT"); this.gui.e3.gpos(p2,3);
    this.gui.llog2 = new alat.gui.classic.Label(this.gui.panel,function (block,data) { return block.info();}); 
        this.gui.llog2.gpos(p1,8); 
    this.gui.but1 = new alat.gui.classic.Button(this.gui.panel,"Insert Row","INSERT_ROW"); this.gui.but1.gpos(1,9);
    this.gui.but2 = new alat.gui.classic.Button(this.gui.panel,"Delete Row","DELETE_ROW"); this.gui.but2.gpos(10,9);
    this.gui.but3 = new alat.gui.classic.Button(this.gui.panel,"Back to Customers","BACK"); this.gui.but3.gpos(21,9);
    // EVENTS
    this.evt = Object();
    this.evt.action_ins = new alat.ActionEvent(this,function(b,d) {b.insert_row();},"INSERT_ROW");
    this.evt.action_del = new alat.ActionEvent(this,function(b,d) {b.delete_row();},"DELETE_ROW");
    this.evt.action_back = new alat.ActionEvent(this,function(b,d) {
        b.close_block();
    },"BACK");    
    this.evt.row_after = new alat.RowAfterEvent(this,function(b,d) {
        if (b.get_row_status()!=alat.const.ROWSTATUS_UPDATE) {
			var cb = function(b,d) {
                if (b.get("RETURN_VALUE")=="YES") {
                    return b.call_server("CustomerDetailBlock","row_after",{},true);
                }
                return false;
            }
            b.call_block("ConfirmBlock",cb,{message:"Confirm action "+b.get_row_status()+"?"});
        } else {
            b.call_server("CustomerDetailBlock","row_after",{},true);
        }
    });
	// initial
    this.draw_gui();
	this.call_server("CustomerDetailBlock","reload",{P_CUSTOMER_ID:this.paramdict['param']['CUSTOMER_ID']},true);

}
alat.local.server.calls["CustomerDetailBlock"] = function(data) {
    // Server-side code
    if (data["command"]=="reload") {
        var t = alat.local.server.tables.customer_detail;
        var customer_id = data["param"]["P_CUSTOMER_ID"];
        var d = t.norm(t.filter("row['CUSTOMER_ID']=="+customer_id));
        var s = alat.lib.str(d);
        return 'block.populate_all('+s+')';
    }
	if (data["command"]=="row_after") {
        var t = alat.local.server.tables.customer_detail;
        var r = t.filter("row['CUSTOMER_ID']=="+data["param"]["CUSTOMER_ID"]+" && row['ORDER_NO']=="+data["param"]["ORDER_NO"]);
        var k = alat.lib.keys(r);
		if (data["block"]["status"]==alat.const.ROWSTATUS_INSERT) {
            if (k.length==0) {
			t.insert_row();
			t.set("CUSTOMER_ID",data["param"]["CUSTOMER_ID"]);
			t.set("ORDER_NO",data["param"]["ORDER_NO"]);
			t.set("AMOUNT",data["param"]["AMOUNT"]);
			return 'true';
            }
            alert ("Order NO already exists!");
            return 'false';
		}
		if (data["block"]["status"]==alat.const.ROWSTATUS_UPDATE) {
            if (k.length==1) { // only one found
                t.rowid = k[0]; 
                t.set("AMOUNT",data["param"]["AMOUNT"]);
                return 'true';
            }
            return 'false';
		}
		if (data["block"]["status"]==alat.const.ROWSTATUS_DELETE) {
            if (k.length==1) { // only one found
                t.rowid = k[0]; 
                t.delete_row();
                return 'true';
            }
            return 'false';
		}
        return 'true';
	}
}

// ==================================================================================================================

alat.local.server.blocks["ConfirmBlock"] = function(paramdict,callback) {
    alat.local.Block.call(this,paramdict,callback);
	// GUI
    this.gui = Object();
	this.gui.manager = new alat.gui.classic.Manager(this);
	this.gui.panel = new alat.gui.classic.Window(this.gui.manager); 
		this.gui.panel.pos("200px","150px");
		this.gui.panel.size("300px","100px");
    this.gui.title = new alat.gui.classic.Title(this.gui.panel,'- DIALOG -',this.gui.panel); this.gui.title.gpos(11,0);    	
	this.gui.label1 = new alat.gui.classic.Label(this.gui.panel,function (block,data) { return block.paramdict.param.message;}); 
		this.gui.label1.gpos(7,1);
    this.gui.but1 = new alat.gui.classic.Button(this.gui.panel,"Yes","ACTION_YES"); this.gui.but1.gpos(10,2);
    this.gui.but2 = new alat.gui.classic.Button(this.gui.panel,"No","ACTION_NO"); this.gui.but2.gpos(15,2);
    // EVENTS
    this.evt = Object();
    this.evt.action_yes = new alat.ActionEvent(this,function(b,d) {
        b.parent.put("RETURN_VALUE","YES");
        b.close_block();
    },"ACTION_YES");
    this.evt.action_no = new alat.ActionEvent(this,function(b,d) {
        b.parent.put("RETURN_VALUE","NO");
        b.close_block();
    },"ACTION_NO");
	// initial
    this.draw_gui();	
}


// ==================================================================================================================

alat.local.server.blocks["MatrixReportBlock"] = function(paramdict,callback) {
    alat.local.Block.call(this,paramdict,callback);
    // DATA
    this.vars = Object();
    this.vars.country = new alat.String(this,"COUNTRY").column();
        this.vars.country.readonly = true;
    this.vars.city = new alat.String(this,"CITY").column();
        this.vars.city.readonly = true;
    this.vars.order_no = new alat.Integer(this,"ORDER_NO").column();
        this.vars.order_no.readonly = true;
    this.vars.amount = new alat.Float(this,"AMOUNT").column();
        this.vars.amount.readonly = true;
	this.allow_insert = function (block,data) { return false; }
	this.allow_delete = function (block,data) { return false; }	
    // GUI
    this.gui = Object();
    this.gui.manager = new alat.gui.classic.Manager(this);
    this.gui.panel = new alat.gui.classic.Window(this.gui.manager); 
        this.gui.panel.pos("50px","50px");
        this.gui.panel.size("800px","320px");
    this.gui.title = new alat.gui.classic.Title(this.gui.panel,'- MATRIX REPORT -',this.gui.panel); this.gui.title.gpos(34,0);    
    this.gui.table = new alat.gui.classic.Table(this.gui.panel,10); 
        this.gui.table.add_column("COUNTRY","Country");
        this.gui.table.add_column("CITY","City");
        this.gui.table.add_column("ORDER_NO","Order No");
        this.gui.table.add_column("AMOUNT","Amount");        
        this.gui.table.gpos(1,1);
        this.gui.table.gwidth(30);
    this.gui.matrix = new alat.gui.classic.Matrix(this.gui.panel,['COUNTRY','CITY'],['ORDER_NO'],'AMOUNT'); 
        this.gui.matrix.gpos(43,1);
        this.gui.matrix.size("350px","270px");
    this.gui.llog2 = new alat.gui.classic.Label(this.gui.panel,function (block,data) { return block.info();}); 
        this.gui.llog2.gpos(1,11); 
    // initial
    this.draw_gui();    
    this.call_server("MatrixReportBlock","reload",{},true);
    this.gui.matrix.calc();
}
alat.local.server.calls["MatrixReportBlock"] = function(data) {
    // Server-side code
    if (data["command"]=="reload") {
        var t = alat.local.server.tables.customer;
        var td = alat.local.server.tables.customer_detail;
        var tjson = t.json();
        var tdjson = td.json();
        var res1 = SQLike.q({
            Select:['*'],
            From:{t1:tjson,t2:tdjson},
            Where:function() {return this.t1.CUSTOMER_ID==this.t2.CUSTOMER_ID}
        })
        var res2 = SQLike.q({
            Select:['t1_COUNTRY','|as|','COUNTRY', 
                    't1_CITY','|as|','CITY', 
                    't2_ORDER_NO','|as|','ORDER_NO',
                    '|sum|','t2_AMOUNT'],
            From:res1,
            GroupBy:['t1_COUNTRY','t1_CITY','t2_ORDER_NO'],
            OrderBy:['COUNTRY','|asc|','CITY','|asc|','ORDER_NO','|asc|']            
        })
        var res3 = t.json_col_rename(res2,'sum_t2_AMOUNT','AMOUNT');
        var d = t.norm(res3);
        var s = alat.lib.str(d);
        return 'block.populate_all('+s+')';
    }
}

// ==================================================================================================================

alat.local.server.blocks["MatrixGeneratedBlock"] = function(paramdict,callback) {
    alat.local.Block.call(this,paramdict,callback);
    // DATA
    this.vars = Object();
    this.vars.country = new alat.String(this,"COUNTRY").column();
    this.vars.department = new alat.String(this,"DEPARTMENT").column();
    this.vars.year = new alat.Integer(this,"YEAR").column();
    this.vars.quarter = new alat.String(this,"QUARTER").column();
    this.vars.month = new alat.String(this,"MONTH").column();
    this.vars.amount = new alat.Float(this,"AMOUNT").column();
    // GUI
    this.gui = Object();
    this.gui.manager = new alat.gui.classic.Manager(this);
    this.gui.panel = new alat.gui.classic.Window(this.gui.manager); 
        this.gui.panel.pos("50px","50px");
        this.gui.panel.size("800px","400px");
    this.gui.title = new alat.gui.classic.Title(this.gui.panel,'- MATRIX GENERATED REPORT -',this.gui.panel); this.gui.title.gpos(30,0);    
    this.gui.matrix = new alat.gui.classic.Matrix(this.gui.panel,['YEAR','QUARTER','MONTH'],['COUNTRY','DEPARTMENT'],'AMOUNT'); 
        this.gui.matrix.gpos(1,1);
        this.gui.matrix.size("760px","350px");
    // generate
    var countries = ["Germany","Italy","United Kingdom","France","Austria","Spain","United States","Canada"];
    var departments = ["Sales","Accounting","Finance","IT"];
    var quarters_months = [["Q1","January"],["Q1","February"],["Q1","March"],
                           ["Q2","April"],["Q2","May"],["Q2","Jun"],
                           ["Q3","July"],["Q3","August"],["Q3","September"],
                           ["Q4","October"],["Q4","November"],["Q4","December"]];
    var header = ["COUNTRY","DEPARTMENT","YEAR","QUARTER","MONTH","AMOUNT"];
    var data = []
    var amount = 1;
    for (var cou in countries) {
        for (var dep in departments) {
            for (var year=2000;year<2014;year++) {
                for (var qm in quarters_months) {
                    var d = [countries[cou],
                             departments[dep],
                             year,
                             quarters_months[qm][0],
                             quarters_months[qm][1],
                             amount
                            ];
                    data.push(d);
                    amount++;
                }
            }
        }
    }
    // initial
    this.draw_gui();
    this.populate_all({"header":header,"data":data})
    var obj = this;
    document.body.style["cursor"]="wait";
    setTimeout(function() {
        obj.gui.matrix.calc();
        obj.draw_gui();
        obj.refresh_gui();
        document.body.style["cursor"]="default";
    },0);
    this.refresh_gui();
}

// ====================================================================================================================

alat.local.server.create_db = function() {
	// customers
	var tc = new alat.local.Table();
	this.tables.customer = tc;
	tc.insert_row({CUSTOMER_ID:1,FIRST_NAME:"John",LAST_NAME:"Johnson",CITY:"Toronto",COUNTRY:"Canada",VIP:true,DATE:"2014-02-28"});
	tc.insert_row({CUSTOMER_ID:2,FIRST_NAME:"Brian",LAST_NAME:"Lewis",CITY:"New York",COUNTRY:"USA"});	
	tc.insert_row({CUSTOMER_ID:3,FIRST_NAME:"Catherine",LAST_NAME:"Robinson",CITY:"New York",COUNTRY:"USA"});	
	tc.insert_row({CUSTOMER_ID:4,FIRST_NAME:"Bob",LAST_NAME:"Walker",CITY:"Washington",COUNTRY:"USA"});	
	tc.insert_row({CUSTOMER_ID:5,FIRST_NAME:"Charlie",LAST_NAME:"Allen",CITY:"Gratz",COUNTRY:"Austria"});	
	tc.insert_row({CUSTOMER_ID:6,FIRST_NAME:"Mark",LAST_NAME:"Scott",CITY:"Los Angeles",COUNTRY:"USA"});	
	tc.insert_row({CUSTOMER_ID:7,FIRST_NAME:"Michael",LAST_NAME:"Young",CITY:"Toronto",COUNTRY:"Canada"});	
	tc.insert_row({CUSTOMER_ID:8,FIRST_NAME:"Jack",LAST_NAME:"Harris",CITY:"Montreal",COUNTRY:"Canada"});	
	tc.insert_row({CUSTOMER_ID:9,FIRST_NAME:"Brian",LAST_NAME:"Smith",CITY:"Los Angeles",COUNTRY:"USA"});	
	tc.insert_row({CUSTOMER_ID:10,FIRST_NAME:"Fred",LAST_NAME:"Nickolson",CITY:"Rome",COUNTRY:"Italy"});	
	tc.insert_row({CUSTOMER_ID:11,FIRST_NAME:"Anne",LAST_NAME:"White",CITY:"Vancounver",COUNTRY:"Canada"});	
	tc.insert_row({CUSTOMER_ID:12,FIRST_NAME:"Jim",LAST_NAME:"Clark",CITY:"Wien",COUNTRY:"Austria"});	
	tc.insert_row({CUSTOMER_ID:13,FIRST_NAME:"Margaret",LAST_NAME:"Thompson",CITY:"Rome",COUNTRY:"Italy"});	
	tc.insert_row({CUSTOMER_ID:14,FIRST_NAME:"Jane",LAST_NAME:"Hill",EMAIL:"jane@mail.com",CITY:"Toronto",COUNTRY:"Canada"});	
	// customer_details
	var tcd = new alat.local.Table();
	this.tables.customer_detail = tcd;
    tcd.insert_row({CUSTOMER_ID:1,ORDER_NO:2,AMOUNT:600});    
	tcd.insert_row({CUSTOMER_ID:3,ORDER_NO:1,AMOUNT:99.55});	
	tcd.insert_row({CUSTOMER_ID:3,ORDER_NO:2,AMOUNT:110});	
	tcd.insert_row({CUSTOMER_ID:3,ORDER_NO:3,AMOUNT:1000.50});	
    tcd.insert_row({CUSTOMER_ID:4,ORDER_NO:3,AMOUNT:200});    
    tcd.insert_row({CUSTOMER_ID:5,ORDER_NO:1,AMOUNT:50});    
    tcd.insert_row({CUSTOMER_ID:6,ORDER_NO:1,AMOUNT:1000});    
	tcd.insert_row({CUSTOMER_ID:7,ORDER_NO:1,AMOUNT:1020.99});	
	tcd.insert_row({CUSTOMER_ID:7,ORDER_NO:2,AMOUNT:200});	
	tcd.insert_row({CUSTOMER_ID:7,ORDER_NO:3,AMOUNT:300});	
	tcd.insert_row({CUSTOMER_ID:7,ORDER_NO:4,AMOUNT:400});	
    tcd.insert_row({CUSTOMER_ID:8,ORDER_NO:1,AMOUNT:300});    
    tcd.insert_row({CUSTOMER_ID:10,ORDER_NO:50,AMOUNT:20});    
    tcd.insert_row({CUSTOMER_ID:11,ORDER_NO:1,AMOUNT:2000});    
	tcd.insert_row({CUSTOMER_ID:12,ORDER_NO:1,AMOUNT:200});	
	tcd.insert_row({CUSTOMER_ID:12,ORDER_NO:2,AMOUNT:300});	
	tcd.insert_row({CUSTOMER_ID:14,ORDER_NO:1,AMOUNT:100.55});	
}

alat.local.server.init_call = function() {
    this.create_db();
    alat.manager.session_id = "test123";
    alat.manager.set_key_event(115,null,alat.const.KEY_HANDLER_TARGET_INSERT_ROW);
    alat.manager.set_key_event(114,null,alat.const.KEY_HANDLER_TARGET_DELETE_ROW);
    alat.manager.set_key_event(13,null,alat.const.KEY_HANDLER_TARGET_ACTION);
    alat.manager.call_block("CustomerBlock");
    tables = alat.local.server.tables;
    tc = alat.local.server.tables.customer;
    td = alat.local.server.tables.customer_detail;
}



