Login_Block = function(paramdict,callback) {
    alat.Block.call(this,paramdict,callback);
    // DATA
    this.vars = Object();
    this.vars.username = new alat.String(this,"USERNAME").variable();
    this.vars.password = new alat.String(this,"PASSWORD").variable();
    // GUI
    this.gui = Object();
    this.gui.manager = new alat.gui.classic.Manager(this);
    this.gui.panel = new alat.gui.classic.Window(this.gui.manager); 
        this.gui.panel.pos("300px","100px");
        this.gui.panel.size("270px","150px");
        this.gui.panel.close_button.hidden = true;
    this.gui.title = new alat.gui.classic.Title(this.gui.panel,'- LOGIN -',this.gui.panel); this.gui.title.gpos(10,0);    
    var p1 = 1; var p2 = 10;
    this.gui.l1 = new alat.gui.classic.Label(this.gui.panel,'Username:'); this.gui.l1.gpos(p1,1.2);
    this.gui.e1 = new alat.gui.classic.Edit(this.gui.panel,"USERNAME"); this.gui.e1.gpos(p2,1);
    this.gui.l2 = new alat.gui.classic.Label(this.gui.panel,'Password:'); this.gui.l2.gpos(p1,2.2);
    this.gui.e2 = new alat.gui.classic.Edit(this.gui.panel,"PASSWORD"); this.gui.e2.gpos(p2,2);
        this.gui.e2.password = true;
    this.gui.but1 = new alat.gui.classic.Button(this.gui.panel,"Login","LOGIN"); this.gui.but1.gpos(19,4);
    // EVENTS
    this.evt = Object();
    this.evt.action_login = new alat.ActionEvent(this,function (block,data) { 
            alat.manager.call_server("index.php","check_login",null,block.eval,false,block,true)
    },"LOGIN");
    // INITIAL
    this.draw_gui();
}

login_init = function() {
    var block = new Login_Block({},null);
    b = block;
    alat.manager.open_block(block);
}

