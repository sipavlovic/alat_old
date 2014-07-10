Main_Block = function(paramdict,callback) {
    alat.Block.call(this,paramdict,callback);
    // GUI
    this.gui = Object();
    this.gui.manager = new alat.gui.classic.Manager(this);
    // Panel1
    this.gui.panel = new alat.gui.classic.Window(this.gui.manager); 
        this.gui.panel.pos("10px","10px");
        this.gui.panel.size("235px","200px");
        this.gui.panel.close_button.hidden = true;
    var x=1; var y=0.5; var w=20; var h=0.7;
    this.gui.but_users = new alat.gui.classic.Button(this.gui.panel,"Users","ACTION_USERS"); 
        this.gui.but_users.gpos(x,y);this.gui.but_users.gsize(w,h);
    this.gui.but_accounts = new alat.gui.classic.Button(this.gui.panel,"Chart of Accounts","ACTION_ACCOUNTS"); 
        this.gui.but_accounts.gpos(x,y+1);this.gui.but_accounts.gsize(w,h);
    this.gui.but_trans = new alat.gui.classic.Button(this.gui.panel,"Transaction Journal","ACTION_TRANS"); 
        this.gui.but_trans.gpos(x,y+2);this.gui.but_trans.gsize(w,h);
    this.gui.but_logout = new alat.gui.classic.Button(this.gui.panel,"Logout","ACTION_LOGOUT"); 
        this.gui.but_logout.gpos(x,y+4);this.gui.but_logout.gsize(w,h);
        
    // Panel2    
    this.gui.panel2 = new alat.gui.classic.Window(this.gui.manager); 
        this.gui.panel2.pos("10px","220px");
        this.gui.panel2.size("235px","160px");
        this.gui.panel2.close_button.hidden = true;
    this.gui.l_user = new alat.gui.classic.Label(this.gui.panel2,function (block,data) { return "Username: "+alat.username; });
        this.gui.l_user.gpos(x,y);
    this.gui.l_keys = new alat.gui.classic.Label(this.gui.panel2,"Keyboard:");
        this.gui.l_keys.gpos(x,y+1);
    this.gui.l_ins = new alat.gui.classic.Label(this.gui.panel2,"F4 - Insert row");
        this.gui.l_ins.gpos(x+1,y+2);
    this.gui.l_del = new alat.gui.classic.Label(this.gui.panel2,"F3 - Delete row");
        this.gui.l_del.gpos(x+1,y+3);
    this.gui.l_action = new alat.gui.classic.Label(this.gui.panel2,"Enter - Action");
        this.gui.l_action.gpos(x+1,y+4);
    
    // EVENTS
    this.evt = Object();
    this.evt.action_users = new alat.ActionEvent(this,function(block,data) {
            alat.manager.call_server("users.php","init",null,block.eval,false,block,true);        
    },"ACTION_USERS");    
    this.evt.action_users = new alat.ActionEvent(this,function(block,data) {
            alat.manager.call_server("main.php","logout",null,block.eval,false,block,true);        
    },"ACTION_LOGOUT");    
    // INITIAL
    this.draw_gui();
} 

main_init = function() {
    // keyboard definition
    alat.manager.set_key_event(115,null,alat.const.KEY_HANDLER_TARGET_INSERT_ROW);
    alat.manager.set_key_event(114,null,alat.const.KEY_HANDLER_TARGET_DELETE_ROW);
    alat.manager.set_key_event(13,null,alat.const.KEY_HANDLER_TARGET_ACTION);
    
    var block = new Main_Block({},null);
    b = block;
    alat.manager.open_block(block);
}