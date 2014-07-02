Main_Block = function(paramdict,callback) {
    alat.Block.call(this,paramdict,callback);
    // GUI
    this.gui = Object();
    this.gui.manager = new alat.gui.classic.Manager(this);
    this.gui.panel = new alat.gui.classic.Window(this.gui.manager); 
        this.gui.panel.pos("10px","10px");
        this.gui.panel.size("235px","300px");
        this.gui.panel.close_button.hidden = true;
    var x=1; var y=0.5; var w=20; var h=0.7;    
    this.gui.but1 = new alat.gui.classic.Button(this.gui.panel,"Users","USERS"); 
        this.gui.but1.gpos(x,y);this.gui.but1.gsize(w,h);
    this.gui.but2 = new alat.gui.classic.Button(this.gui.panel,"Products","PRODUCTS"); 
        this.gui.but2.gpos(x,y+1);this.gui.but2.gsize(w,h);
    this.gui.but3 = new alat.gui.classic.Button(this.gui.panel,"Stores","STORES"); 
        this.gui.but3.gpos(x,y+2);this.gui.but3.gsize(w,h);
    // INITIAL
    this.draw_gui();
} 

main_init = function() {
    var block = new Main_Block({},null);
    b = block;
    alat.manager.open_block(block);
}