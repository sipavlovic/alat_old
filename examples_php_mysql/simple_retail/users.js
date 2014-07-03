Users_Block = function(paramdict,callback) {
    alat.Block.call(this,paramdict,callback);
    // DATA
    this.vars = Object();
    this.vars.id = new alat.Integer(this,"ID").column();
        this.vars.id.readonly = true;
    this.vars.username = new alat.String(this,"USERNAME").column();
        this.vars.username.readonly = function (block,data) { return block.get_row_status()!=alat.const.ROWSTATUS_INSERT; }
    this.vars.password = new alat.String(this,"PASSWORD").column();
    // GUI
    this.gui = Object();
    this.gui.manager = new alat.gui.classic.Manager(this);
    this.gui.panel = new alat.gui.classic.Window(this.gui.manager); 
        this.gui.panel.pos("100px","40px");
        this.gui.panel.size("335px","290px");
    this.gui.title = new alat.gui.classic.Title(this.gui.panel,'- USERS -',this.gui.panel); this.gui.title.gpos(13,0);    
    this.gui.table = new alat.gui.classic.Table(this.gui.panel,10); 
        this.gui.table.add_column("ID","Id");
        this.gui.table.add_column("USERNAME","Username");
        this.gui.table.add_column("PASSWORD","Password");
        this.gui.table.gpos(1,1);
        this.gui.table.gwidth(30);    
    // EVENTS
    this.evt = Object();
    this.evt.row_after = new alat.RowAfterEvent(this,function(block,data) {
            if (block.get_row_status()==alat.const.ROWSTATUS_UPDATE) {
                if (block.is_changed()) {
                        alat.manager.call_server("users.php","row_after",null,block.eval,false,block,true);
                }
            } else {
                alat.manager.call_server("users.php","row_after",null,block.eval,false,block,true);
            }
        });        
    // INITIAL
    this.draw_gui();
    alat.manager.call_server("users.php","populate",null,this.eval,false,this,true);
} 

users_init = function() {
    var block = new Users_Block({},null);
    b = block;
    alat.manager.open_block(block);
} 

users_init();