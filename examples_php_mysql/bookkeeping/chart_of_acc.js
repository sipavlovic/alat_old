Chart_of_Acc_Block = function(paramdict,callback) {
    alat.Block.call(this,paramdict,callback);
    this.allow_insert = true;
    this.allow_delete = true;
    this.default_readonly = false;
    // DATA
    this.vars = Object();
    this.vars.id = new alat.Integer(this,"ID").column();
        this.vars.id.readonly = true;
    this.vars.code = new alat.Integer(this,"CODE").column();
    this.vars.name = new alat.String(this,"NAME").column();
    this.vars.account_type_id = new alat.Integer(this,"ACCOUNT_TYPE_ID").column();
    this.vars.typename = new alat.String(this,"TYPENAME").column();
        this.vars.typename.readonly = true;
    this.vars.parent_account_id = new alat.Integer(this,"PARENT_ACCOUNT_ID").column();
    // GUI
    this.gui = Object();
    this.gui.manager = new alat.gui.classic.Manager(this);
    this.gui.panel = new alat.gui.classic.Window(this.gui.manager); 
        this.gui.panel.pos("100px","40px");
        this.gui.panel.size("430px","290px");
    this.gui.title = new alat.gui.classic.Title(this.gui.panel,'- CHART OF ACCOUNTS -',this.gui.panel); this.gui.title.gpos(13,0);    
    this.gui.table = new alat.gui.classic.Table(this.gui.panel,10); 
        this.gui.table.add_column("ID","Id","50px");
        this.gui.table.add_column("CODE","Code","50px");
        this.gui.table.add_column("NAME","Name","200px");
        this.gui.table.add_column("ACCOUNT_TYPE_ID","Acc Type Id");
        this.gui.table.add_column("TYPENAME","Type Name","150px");
        this.gui.table.add_column("PARENT_ACCOUNT_ID","Parent Acc Id");
        this.gui.table.gpos(1,1);
        this.gui.table.gwidth(30);    
    // EVENTS
    this.evt = Object();
    this.evt.row_after = new alat.RowAfterEvent(this,function(block,data) {
            if (block.get_row_status()==alat.const.ROWSTATUS_UPDATE) {
                if (block.is_changed()) {
                        var ajaxobj = alat.manager.call_server("chart_of_acc.php","row_after",null,block.ajax_eval,false,block,true);
                        return !ajaxobj.error;
                }
            } else {
                var ajaxobj = alat.manager.call_server("chart_of_acc.php","row_after",null,block.ajax_eval,false,block,true);
                return !ajaxobj.error;
            }
        });        
    // INITIAL
    this.draw_gui();
    alat.manager.call_server("chart_of_acc.php","populate",null,this.ajax_eval,false,this,true);
} 

chart_of_acc_init = function() {
    var block = new Chart_of_Acc_Block({},null);
    b = block;
    alat.manager.open_block(block);
} 

chart_of_acc_init();    

 
