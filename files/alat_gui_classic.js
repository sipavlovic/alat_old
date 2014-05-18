// ------------------------------
// Root namespace for gui classic
// ------------------------------
alat.gui.classic = new Object();
alat.gui.classic.const = new Object();

// ---------
// Constants
// ---------
alat.gui.classic.const.CLASS_MANAGER = "MANAGER";
alat.gui.classic.const.CLASS_WINDOW = "WINDOW";
alat.gui.classic.const.CLASS_PANEL = "PANEL";
alat.gui.classic.const.CLASS_TABLE = "TABLE";
alat.gui.classic.const.CLASS_MATRIX = "MATRIX";
alat.gui.classic.const.CLASS_EDIT = "EDIT";
alat.gui.classic.const.CLASS_LABEL = "LABEL";
alat.gui.classic.const.CLASS_TITLE = "TITLE";
alat.gui.classic.const.CLASS_BUTTON = "BUTTON";
alat.gui.classic.const.CLASS_CLOSE_BUTTON = "CLOSE_BUTTON";
alat.gui.classic.const.CLASS_SCROLLBAR = "SCROLLBAR";
// Scrollbar orientation
alat.gui.classic.const.ORIENTATION_VERTICAL = "VERTICAL";
alat.gui.classic.const.ORIENTATION_HORIZONTAL = "HORIZONTAL";
// CSS prefix
alat.gui.classic.const.CSS_PREFIX = "ALAT_CLASSIC_";

// ---------------------------------
// Function disabledEventPropagation
// ---------------------------------
alat.gui.classic.disabledEventPropagation = function(event) {
	if (event.stopPropagation){
		event.stopPropagation();
	}
	else if(window.event){
		window.event.cancelBubble=true;
	}
};

// ----------------------------
// Function preventEventDefault
// ----------------------------
alat.gui.classic.preventEventDefault = function(event) {
	if (event.preventDefault){
		event.preventDefault();
	}
	else if(window.event){
	}
}

// --------------------
// Function deselectAll
// --------------------
alat.gui.classic.deselectAll = function() {
    if (document.selection) {
        document.selection.empty();
    } else {
        window.getSelection().removeAllRanges();
    }
}

// --------------------
// Function create_node
// --------------------
alat.gui.classic.create_node = function(parent_object,parent_node,element_tag) {
    var new_node = document.createElement(element_tag);
    new_node.id = alat.manager.new_id();
    new_node.parent_object = parent_object;
    new_node.hidden=false;
    parent_node.appendChild(new_node);
    return new_node;
}


// ------------------
// Class StyleElement
// Style manipulation
// ------------------
alat.gui.classic.StyleElement = function() {
	// dictionary for html tag style property
    this.styledict = {};
	// set style property in styledict
    this.set_style = function(paramname,valueobj) {
        this.styledict[paramname]=valueobj;
    }
	// get style property from style dict
    this.get_style = function(paramname) {
        return this.styledict[paramname];
    }
	// delete style property from styledict
    this.del_style = function(paramname) {
        delete this.styledict[paramname];
    }
	// calculate text for tag style property
	// properties can be callbacks which will be recalculated at every draw or refresh
    this.calc_style = function() {
        var cssText = "";
        for (var param in this.styledict) {
            var value = this.block.expr(this.styledict[param]);
            cssText = cssText + param + ':' + value + ';';
        }
        return cssText;
    }
	// set position style property
    this.pos = function(left,top) {
        this.set_style("position","absolute");
        this.set_style("top",top);
        this.set_style("left",left);
    }
	// set size style property
    this.size = function(width,height) {
        this.set_style("width",width);
        this.set_style("height",height);
    }
	// set position style property in panel grid units and margin
    this.gpos = function(gleft,gtop) {
        this.pos(this.block.gui_manager.gx2px(gleft),this.block.gui_manager.gy2px(gtop));
    }
	// set width style property in panel grid units and margin
    this.gwidth = function(gwidth) {
        this.set_style("width",this.block.gui_manager.gx2px(gwidth));
    }
	// set height style property in panel grid units and margin
    this.gheight = function(gheight) {
        this.set_style("height",this.block.gui_manager.gy2px(gheight));
    }
	// gheight and gwidth at the same time
	this.gsize = function(gwidth,gheight) {
		this.gwidth(gwidth);
		this.gheight(gheight);
	}
	
}


// -------------------------
// Class GUIElement
// Generic GUI element class
// -------------------------
alat.gui.classic.GUIElement = function(parent,className) {
	// parent
    this.parent = parent;
	// class identification
    this.className = className;
	// children object list
    this.childrenlist = [];
	// copy parent block
    this.block = parent.block;
	// action_name property - actionname for ActionEvent
	this.action_name = null;
	// Function set_action(actionname)
	this.set_action = function(actionname) {
		this.action_name = actionname;
	}
	// put object to parent's children object list
    this.parent.childrenlist.push(this);
	// StyleElement class inheritance
    alat.gui.classic.StyleElement.call(this);
	// draw this and all children objects
    this.draw_all = function() {
        this.draw();
        this.obj.style.cssText += this.calc_style();
        for (var i in this.childrenlist) {
            this.childrenlist[i].draw_all();
        }
    }
	// refresh this and all children objects
    this.refresh_all = function() {
		if (this.obj==null) {
			return;
		}
        this.refresh();
        this.obj.style.cssText += this.calc_style();
        for (var i in this.childrenlist) {
            this.childrenlist[i].refresh_all();
        }
    }
	// Function add_class(tagobj,classname)
	this.add_class = function(tagobj,classname) {
		if (tagobj) {
			var name = alat.gui.classic.const.CSS_PREFIX+classname;
			tagobj.classList.add(name.toUpperCase());
		}
	}
	// Function remove_class(tagobj,classname)
	this.remove_class = function(tagobj,classname) {
		if (tagobj) {
			var name = alat.gui.classic.const.CSS_PREFIX+classname;
			tagobj.classList.remove(name.toUpperCase());
		}
	}
	// Function clear_class(tagobj)
	this.clear_class = function(tagobj) {
		if (tagobj) {
			tagobj.className="";
		}
	}
	// Function clear: remove html tags
    this.clear = function() {
        //this.obj.parentNode.removeChild(this.obj);
        if (this.obj) {
            this.obj.parentNode.removeChild(this.obj);
        }
    }        
    // Function add: add child tag to apropriate tag
    this.add = function(tag_obj) {
        this.obj.appendChild(tag_obj);
    }
    // Function to be overrided by children class
    this.draw = function() {};
    this.refresh = function() {};
    // overlay_object property
    this.overlay_obj = null
    // function create_overlay
    this.create_overlay = function() {
        if (this.overlay_obj) {
            this.remove_overlay();
        }
        if (this.obj) {
            var o = document.createElement('div');
            o.id = alat.manager.new_id();
            o.parent_object = this;
            o.hidden=false;
            this.add_class(o,"overlay");
            this.obj.parentNode.appendChild(o);
            this.overlay_obj = o;
			// Needed for mouse event blocking in IE
            this.overlay_obj.style["backgroundColor"]="black";
            this.overlay_obj.style["opacity"]="0.0";
			// refresh
            this.refresh_overlay();
            o.onselectstart = function(e) {
                alat.gui.classic.disabledEventPropagation(e);
                alat.gui.classic.preventEventDefault(e);
                return false;                
            }
        }
    }
    // function remove_overlay 
    this.remove_overlay = function() {
        if (this.obj && this.overlay_obj) {
            this.overlay_obj.parentNode.removeChild(this.overlay_obj);
            this.overlay_obj = null;
        }
    }
    // function refresh_overlay
    this.refresh_overlay = function() {
        if (this.obj && this.overlay_obj) {
            this.overlay_obj.style.position = 'absolute';
            this.overlay_obj.style.left = this.obj.offsetLeft+'px';
            this.overlay_obj.style.top = this.obj.offsetTop+'px';
            this.overlay_obj.style.width = this.obj.offsetWidth+'px';
            this.overlay_obj.style.height = this.obj.offsetHeight+'px';
        }    
    }
    // function: create_overlay_all: create overlays for all children
    this.create_overlay_all = function() {
        this.create_overlay();
        for (var i in this.childrenlist) {
            this.childrenlist[i].create_overlay();
        }
    }
    // function: remove_overlay_all: remove overlays for all children
    this.remove_overlay_all = function() {
        this.remove_overlay();
        for (var i in this.childrenlist) {
            this.childrenlist[i].remove_overlay();
        }
    }
    // function: refresh_overlay_all: refresh overlays for all children
    this.refresh_overlay_all = function() {
        this.refresh_overlay();
        for (var i in this.childrenlist) {
            this.childrenlist[i].refresh_overlay();
        }
    }    
}



// -----------
// Class Panel
// -----------
alat.gui.classic.Panel = function(parent) {
	// GUIElement class inheritance
    alat.gui.classic.GUIElement.call(this,parent,alat.gui.classic.const.CLASS_PANEL);
	// draw panel
    this.draw = function() {
        this.obj = document.createElement('div');
        this.obj.id = alat.manager.new_id();
        this.obj.parent_object = this;
        this.obj.hidden=false;
		this.add_class(this.obj,this.className);
		//this.parent.obj.appendChild(this.obj);
        this.parent.add(this.obj);
    }
}







// --------------
// Class Window
// Closable Panel
// --------------
alat.gui.classic.Window = function(parent) {
    // GUIElement class inheritance
    alat.gui.classic.GUIElement.call(this,parent,alat.gui.classic.const.CLASS_WINDOW);
    // close_button
    this.close_button = new alat.gui.classic.Close_Button(this);
    // draw panel
    this.draw = function() {
        // parent overlays
        if (this.block.parent) {
            this.block.parent.gui_manager.create_overlay_all();
        }
        // main obj
        this.obj = document.createElement('div');
        this.obj.id = alat.manager.new_id();
        this.obj.parent_object = this;
        this.obj.hidden=false;
		this.add_class(this.obj,this.className);		
        this.add_class(this.obj,"shadow");
        //this.parent.obj.appendChild(this.obj);
        this.parent.add(this.obj);
        // background div
        this.background_obj = document.createElement('div');
        this.background_obj.id = alat.manager.new_id();
        this.background_obj.parent_object = this;
        this.background_obj.hidden=false;
		this.add_class(this.background_obj,"background_div");
		this.add_class(this.background_obj,"round");
        this.obj.appendChild(this.background_obj);
    }
    // function refresh
    this.refresh = function() {
        if (this.obj==null) {
            return;
        }
        // background div
        this.background_obj.style.position = 'absolute';
        this.background_obj.style.left = 0+'px';
        this.background_obj.style.top = 0+'px';
        this.background_obj.style.width = this.obj.offsetWidth+'px';
        this.background_obj.style.height = this.obj.offsetHeight+'px';
        // parent overlays
        if (this.block.parent) {
            this.block.parent.gui_manager.refresh_overlay_all();
        }
    }
    // Function clear: remove html tags
    this.clear = function() {
        if (this.obj) {
            this.obj.parentNode.removeChild(this.obj);
        }
        // parent overlays
        if (this.block.parent) {
            this.block.parent.gui_manager.remove_overlay_all();
        }
    }        
}


// ------------------
// Class Close_Button
// ------------------
alat.gui.classic.Close_Button = function(parent) {
    // GUIElement class inheritance
    alat.gui.classic.GUIElement.call(this,parent,alat.gui.classic.const.CLASS_CLOSE_BUTTON);
    // label property
    this.label = 'X';
	// margins property
    this.margin_x=2;
    this.margin_y=4;
	// click event props
	this.original_x=0;
	this.original_y=0;
	this.clicked = false;
    // draw tag
    this.draw = function() {
        this.obj = document.createElement('a');
        this.obj.id = alat.manager.new_id();
        this.obj.parent_object = this;
        this.obj.hidden=false;
		this.obj.innerHTML = this.label;
		
        this.parent.add(this.obj);
        this.set_style("cursor","default");
		this.add_class(this.obj,this.className);	
		this.obj.onmousedown = function(event) {
			var o = event.target.parent_object;
			o.clicked = true;
			o.original_x=o.obj.offsetLeft;
			o.original_y=o.obj.offsetTop;
			o.obj.style["left"]=o.original_x+"px";
			o.obj.style["top"]=o.original_y+1+"px";
		}
		this.obj.onmouseup = function(event) {
			var o = event.target.parent_object;
			if (o.clicked) {
				o.obj.style["left"]=o.original_x+"px";
				o.obj.style["top"]=o.original_y+"px";
				o.clicked = false;
				o.block.close_block();
			}
		}
		this.obj.onmouseout = function(event) {
			var o = event.target.parent_object;
			if (o.clicked) {
				o.obj.style["left"]=o.original_x+"px";
				o.obj.style["top"]=o.original_y+"px";
				o.clicked = false;
			}
		}
    }
    // refresh
    this.refresh = function() {
        if (this.obj==null) {
            return;
        }
        this.pos((this.parent.obj.offsetWidth-this.obj.offsetWidth-this.margin_x)+"px",
                 this.margin_y+"px");
		this.original_x=this.obj.offsetLeft;
		this.original_y=this.obj.offsetTop;	 
    }
}



// -----------
// Class Table
// -----------
alat.gui.classic.Table = function(parent,page_size) {
    // GUIElement class inheritance
    alat.gui.classic.GUIElement.call(this,parent,alat.gui.classic.const.CLASS_TABLE);
	// field name list
    this.columnlist = [];
    // current_x, current_y - for internal table focus
    this.current_x = 0;
    this.current_y = 0;
	// first to show (row pos in buffer)
    this.first_to_show = 0;
	// page_size
	this.page_size = alat.lib.nvl(page_size,1);
	this.block.gui_manager.page_size = page_size;
	// function add_column
	this.add_column = function(fieldname,title) {
		var col = new Object();
		col.fieldname = fieldname;
		col.title = title;
		this.columnlist.push(col);
	}
	// set cell inner html value
    this.set = function(x,y,value) {
        //this.cell[y][x].innerHTML = value;
		this.cell_div[y][x].value = value;
    }
	// get cell inner html value
    this.get = function(x,y) {
        //return this.cell[y][x].innerHTML
        return this.cell_div[y][x].value;
    }
	// show first row
    this.showfirst = function(pos) {
        this.first_to_show = alat.lib.nvl(this.block.buffer.get_goal_pos(pos),0);
    }
	this.new_cell_tag = function(tagname,parenttag) {
		var tag = document.createElement(tagname);
		tag.id = alat.manager.new_id();
		tag.block = this.block;
		tag.parent_object = parenttag;
		tag.style["min-width"] = "100px";
		tag.style["max-width"] = "100px";
		tag.style["width"] = "100px";	
		tag.style["overflow"] = "hidden";
		tag.style["white-space"]="nowrap";
		tag.style["padding"]="0";
		tag.style["margin"]="0 auto";
		parenttag.appendChild(tag);
		return tag;
	}
	this.scroll2column = function(colnum) {
		this.obj_inner_div.scrollLeft = this.header[colnum].offsetLeft;
	}
	// keydown handler for input cells
    this.cell_on_key_down = function(event) {
        var o = event.target;
        if ([40,38,33,34,114,115].indexOf(event.keyCode)!=-1) {
            o.alat_block.gui_set(o.alat_fieldname,o.alat_block.calc_eval(o.value));
        }
		// action
		if (event.keyCode == 13) {
			o.alat_table.run_action(o.alat_fieldname);
		}
        alat.manager.current_block().gui_manager.on_key_down(event);
    }
	// run_action
	this.run_action = function(fieldname) {
		//alert(fieldname);
		d = {};
		d.fieldname = fieldname;
		var f = this.block.buffer.fielddict[fieldname];
		this.block.action(f.action_name,d);
	}
	// draw tags
    this.draw = function() {
		// outer div - main obj
        this.obj = document.createElement('div');
        this.obj.id = alat.manager.new_id();
        this.obj.parent_object = this;
        this.obj.hidden=false;
		this.add_class(this.obj,this.className);		
		this.add_class(this.obj,"shadow");
		//this.parent.obj.appendChild(this.obj);
        this.parent.add(this.obj);
		// inner div
        this.obj_inner_div = document.createElement('div');
        this.obj_inner_div.id = alat.manager.new_id();
        this.obj_inner_div.parent_object = this.obj;
        this.obj_inner_div.hidden=false;
		this.obj_inner_div.style.width = "400px";
		this.obj_inner_div.style.overflow = "auto";
		this.obj.appendChild(this.obj_inner_div);		
        // table tag 
        this.obj_table = document.createElement('table');
        this.obj_table.id = alat.manager.new_id();
        this.obj_table.parent_object = this.obj_inner_div;
        this.obj_table.hidden=false;
		this.obj_inner_div.appendChild(this.obj_table);
		// table header
		this.obj_header = document.createElement('tr');
        this.obj_header.id = alat.manager.new_id();
        this.obj_header.parent_object = this.obj_table;
        this.obj_table.appendChild(this.obj_header);
		this.header = [];
		for (var i in this.columnlist) {
			var t = this.new_cell_tag('th',this.obj_header);
            //t.innerHTML=this.columnlist[i].fieldname;
			var c = this.columnlist[i];
			if (c.title==null) {
				t.innerHTML=c.fieldname
			} else {
				t.innerHTML=this.block.expr(c.title);
			}
			this.header.push(t);
		}
		// table cells
		this.row = [];
		this.cell = {};
		this.cell_div = {};
		for (var y=0;y<this.page_size;y++) {
			var r = document.createElement('tr');
			r.id = alat.manager.new_id();
			r.block = this.block;
			r.parent_object = this.obj_table;
            r.table_object = this;
			this.obj_table.appendChild(r);
			this.row.push(r);
			// cols
			this.cell[y]={};
			this.cell_div[y]={};
            for (var x in this.columnlist) {
				var t = this.new_cell_tag('td',r);
                t.alat_fieldname = this.columnlist[x].fieldname;
                t.alat_block = this.block;
                t.alat_table = this;
                t.alat_x = x;
                t.alat_y = y;
                this.cell[y][x]=t;
				// inner div
				var d = this.new_cell_tag('input',t);
				d.readOnly = true;
                d.style["border-style"]="none";
                d.alat_fieldname = this.columnlist[x].fieldname;
                d.alat_block = this.block;
                d.alat_table = this;
                d.alat_x = x;
                d.alat_y = y;
                d.onchange = function(event) {
                    var o = event.target;  
                    if (o.row_rowid==o.alat_block.buffer.rowid) { 
                        o.alat_block.gui_set(o.alat_fieldname,o.alat_block.calc_eval(o.value)); 
                    } 
                }
                d.onkeydown = function(event) {
					var o = event.target;o.alat_table.cell_on_key_down(event);
				}
                this.cell_div[y][x]=d;
			}
			// on click event for row
            r.onclick = function(event) {
                var r = event.target.parent_object;  
                var o = event.target; 
                o.alat_block.goto_row(r.row_rowid); 
                o.alat_table.current_x = o.alat_x; 
                o.alat_table.current_y = o.alat_y; 
                o.alat_block.gui_manager.set_focus(o.alat_table); 
            }
			// on dbl click event for row
            r.ondblclick = function(event) {
                var r = event.target.parent_object;  
                var o = event.target; 
                o.alat_block.goto_row(r.row_rowid); 
                o.alat_table.current_x = o.alat_x; 
                o.alat_table.current_y = o.alat_y; 
                o.alat_block.gui_manager.set_focus(o.alat_table);
				// action
				o.alat_table.run_action(o.alat_table.columnlist[parseInt(o.alat_table.current_x)].fieldname);
            }
		}
	}
	// function refresh
    this.refresh = function() {
		// if empty return
		if (this.obj==null) {
			return;
		}
		// header refresh
		for (var i in this.columnlist) {
			var t = this.header[i];
			var c = this.columnlist[i];
			if (c.title==null) {
				t.innerHTML=c.fieldname
			} else {
				t.innerHTML=this.block.expr(c.title);
			}
		}		
		// rowid to pos
        var pos = this.block.buffer.rowid2pos(this.block.buffer.rowid);
		// if rowpos < first to show then adjust first to show
        if (pos<this.first_to_show) { 
            this.showfirst(pos); 
        }
		// if pos > first to show + page size -1 then adjust first to show
        if (pos>this.first_to_show+this.block.gui_manager.page_size-1) { 
            this.showfirst(pos-this.block.gui_manager.page_size+1); 
        }
		// pos = first to show
        var pos = this.first_to_show;
		// for y from 0 to page size
        for (var y=0;y<this.block.gui_manager.page_size;y++) {
            // get rowid
            var rowid = this.block.buffer.pos2rowid(pos+y);
            if (rowid==this.block.buffer.rowid) {
                this.current_y = y;
            }
            // full row
            if (this.block.buffer.get_pos_exists(pos+y)) {
				// for each column
                for (var x in this.columnlist) {
					// set cell with value from block
                    this.set(x,y,this.block.gui_get(this.columnlist[x].fieldname,rowid));
					// if current row
                    if (rowid==this.block.buffer.rowid) {
						this.clear_class(this.cell[y][x]);
						this.clear_class(this.cell_div[y][x]);
						this.add_class(this.cell[y][x],"current_cell");
						this.add_class(this.cell_div[y][x],"current_cell");
                        this.cell_div[y][x].readOnly = this.block.buffer.fielddict[this.columnlist[x].fieldname].is_readonly();
                   } else {
						this.clear_class(this.cell[y][x]);
						this.clear_class(this.cell_div[y][x]);
				   		this.add_class(this.cell[y][x],"data_cell");
						this.add_class(this.cell_div[y][x],"data_cell");
                        this.cell_div[y][x].readOnly = true;
                    }
                    this.cell[y][x].row_rowid=rowid;                    
					this.cell_div[y][x].row_rowid=rowid;
                    this.row[y].row_rowid=rowid;
                    this.cell[y][x].disabled=false
                    this.cell_div[y][x].disabled=false;
                }
            } else {
            // empty row
                for (var x in this.columnlist) {
                    this.set(x,y,'');
					this.clear_class(this.cell[y][x]);
					this.clear_class(this.cell_div[y][x]);
					this.add_class(this.cell[y][x],"empty_cell");
					this.add_class(this.cell_div[y][x],"empty_cell");
                    this.cell[y][x].disabled=true;
                    this.cell_div[y][x].disabled=true;
                }            
            }
        }
    }
    // focus receive
    this.focus_receive = function() {
        this.block.gui_manager.current_focus = this;
        var obj = this.cell_div[this.current_y][this.current_x];
        obj.focus();
        if (obj.select!=null) {
            obj.select();
        }
    }
    // focus next send
    this.focus_next_send = function(target) {
        if (this.current_x<this.columnlist.length-1) {
            this.block.gui_manager.current_focus = this;
            this.current_x++;
        } else {
            if (target!=null) { 
                target.focus_next_receive(); 
            }
        }
    }
    // focus prev send
    this.focus_prev_send = function(target) {
        if (this.current_x>0) {
            this.block.gui_manager.current_focus = this;
            this.current_x--;
        } else {
            if (target!=null) { 
                target.focus_prev_receive(); 
            }
        }
    }
    // focus next receive
    this.focus_next_receive = function() {
        this.block.gui_manager.current_focus = this;
        this.current_x=0;
    }
    // focus prev receive
    this.focus_prev_receive = function() {
        this.block.gui_manager.current_focus = this;
        this.current_x=this.columnlist.length-1;
    }
    // add to focuslist
    this.block.gui_manager.add2focus(this);    
}





// -----------
// Class Matrix
// -----------
alat.gui.classic.Matrix = function(parent,x_column_list,y_column_list,value_column) {
    // GUIElement class inheritance
    alat.gui.classic.GUIElement.call(this,parent,alat.gui.classic.const.CLASS_MATRIX);
    // Scrollbars
    this.vscroll = new alat.gui.classic.Scrollbar(this);
    this.hscroll = new alat.gui.classic.Scrollbar(this);
    this.hscroll.horizontal();
    // Parameter Properties
    this.x_column_list = x_column_list;
    this.y_column_list = y_column_list;
    this.value_column = value_column;
    // Storage properties
    this.x_column_values = {};
    this.y_column_values = {};
    this.values_rowid_dict = {};    
	// run_action
	this.run_action = function(x,y) {
		//alert(x+","+y);
		d = {};
		d.x = x;
		d.y = y;
		this.block.action(this.action_name,d);
	}
    // function calc
    this.calc = function() {
        this.x_column_values = {};
        this.y_column_values = {};
        this.values_rowid_dict = {};    
        var x_column_values_keys = {};
        var y_column_values_keys = {};
        var ix = 0;
        var iy = 0;
        for (var rowid in this.block.buffer.rowidlist) {
            // x column
            var x_values = [];
            for (var cname in this.x_column_list) {
                x_values.push(this.block.buffer.get(this.x_column_list[cname],rowid));
            }
            var x_valkey = alat.lib.str(x_values);
            var x_key = x_column_values_keys[x_valkey];
            if (x_key==null) {
                x_key = ix;
                ix++;
                this.x_column_values[x_key]=x_values;
                x_column_values_keys[x_valkey]=x_key;
            }
            // y column
            var y_values = [];
            for (var cname in this.y_column_list) {
                y_values.push(this.block.buffer.get(this.y_column_list[cname],rowid));
            }
            var y_valkey = alat.lib.str(y_values);
            var y_key = y_column_values_keys[y_valkey];
            if (y_key==null) {
                y_key = iy;
                iy++;
                this.y_column_values[y_key]=y_values;
                y_column_values_keys[y_valkey]=y_key;
            }
            // values_rowid_dict
            this.values_rowid_dict[rowid]=[x_key,y_key];
        }
    }
    // draw_x_values
    this.draw_x_values = function() {
        for (var i in this.x_column_list) {
            var tr = alat.gui.classic.create_node(this,this.layout_table_x,'tr');
            var td = null;
            var last = null;
            var count = 0;
            for (var j in this.x_column_values) {
                var value = this.x_column_values[j][i];
                
                if (j==0 || value!=last) {
                    td = alat.gui.classic.create_node(this,tr,'th');
                    td.style["width"]="60px";
                    td.style["minWidth"]="60px";
                    td.innerHTML = value;
                    last = value;
                    count = 1;
                } else {
                    count++;
                    td.colSpan=count;
                }
            }
        }
    }
    // draw_y_values
    this.draw_y_values = function() {
        var tr = {};
        for (var i in this.y_column_list) {
            var td = null;
            var last = null;
            var count = 0;
            for (var j in this.y_column_values) {
                if (i==0) {
                    tr[j] = alat.gui.classic.create_node(this,this.layout_table_y,'tr');
                }
                var value = this.y_column_values[j][i];
                if (j==0 || value!=last) {
                    td = alat.gui.classic.create_node(this,tr[j],'th');
                    td.innerHTML = value;
                    last = value;
                    count = 1;
                } else {
                    count++;
                    td.rowSpan=count;
                }
            }
        }
    }
    // draw_values
    this.draw_values = function() {
        var rows = [];
        var cells = [];
        for (var j in this.y_column_values) {
            var row = alat.gui.classic.create_node(this,this.layout_table_values,'tr');
            rows.push(row);
            cells.push([]);
            for (var i in this.x_column_values) {
                var cell = alat.gui.classic.create_node(this,row,'td');
                cell.alat_block = this.block;
                cell.alat_matrix = this;
                cell.alat_x = i;
                cell.alat_y = j;
                //cell.style["width"]="60px";
                //cell.style["min-width"]="60px";
                cell.tabIndex=-1;
                cells[j].push(cell);
				// on dbl click event for row
				cell.ondblclick = function(event) {
					var o = event.target; 
					// action
					o.alat_matrix.run_action(o.alat_x,o.alat_y);
				}
            }
        }
        for (var rowid in this.values_rowid_dict) {
            var x = this.values_rowid_dict[rowid][0];
            var y = this.values_rowid_dict[rowid][1];
            cells[y][x].innerHTML = this.block.buffer.get(this.value_column,rowid);
        }
    }
    // function show_cell    
    this.show_cell = function(x,y) {
        var c= this.rightbottomdiv.childNodes[0].childNodes[y].childNodes[x];
        c.scrollIntoView();
        return c;
    }
	// function get_cell_obj
	this.get_cell_obj = function(x,y) {
        return this.rightbottomdiv.childNodes[0].childNodes[y].childNodes[x];
	}
    // draw tags
    this.draw = function() {
        // main obj
        this.obj = document.createElement('div');
        this.obj.id = alat.manager.new_id();
        this.obj.parent_object = this;
        this.obj.hidden=true;
		this.add_class(this.obj,this.className);
		this.add_class(this.obj,"shadow");
        this.parent.add(this.obj);
        // layout
        this.leftbottomdiv = alat.gui.classic.create_node(this,this.obj,'div');
            this.leftbottomdiv.style["position"]="absolute";
            this.leftbottomdiv.style["overflow"]="hidden";
            this.leftbottomdiv.style["backgroundColor"]="#333";
        this.righttopdiv = alat.gui.classic.create_node(this,this.obj,'div');
            this.righttopdiv.style["position"]="absolute";
            this.righttopdiv.style["overflow"]="hidden";
            this.righttopdiv.style["backgroundColor"]="#333";
        this.rightbottomdiv = alat.gui.classic.create_node(this,this.obj,'div');
            this.rightbottomdiv.style["position"]="absolute";
            this.rightbottomdiv.style["overflow"]="hidden";
            this.rightbottomdiv.style["backgroundColor"]="white";
        this.layout_table_x = alat.gui.classic.create_node(this,this.righttopdiv,'table');
        this.layout_table_y = alat.gui.classic.create_node(this,this.leftbottomdiv,'table');
        this.layout_table_values = alat.gui.classic.create_node(this,this.rightbottomdiv,'table');
        this.draw_x_values();
        this.draw_y_values();
        this.draw_values();
		// unhide
        this.obj.hidden=false;
        this.adjust_sizes();
        // vertical scrollbar
        this.vscroll.on_refresh = function() {
            this.original_total = this.parent.layout_table_y.offsetHeight;
            this.original_size = this.parent.leftbottomdiv.offsetHeight;
            this.original_pos = this.parent.leftbottomdiv.scrollTop;
            //console.log('On refresh vertical:'+this.original_total+','+this.original_size);
        }
        this.vscroll.on_move = function() {
            this.parent.leftbottomdiv.scrollTop = this.original_pos;
            this.parent.rightbottomdiv.scrollTop = this.original_pos;            
        }
        // horizontal scrollbar
        this.hscroll.on_refresh = function() {
            this.original_total = this.parent.layout_table_x.offsetWidth;
            this.original_size = this.parent.righttopdiv.offsetWidth;
            this.original_pos = this.parent.righttopdiv.scrollLeft;
        }
        this.hscroll.on_move = function() {
            this.parent.righttopdiv.scrollLeft = this.original_pos;
            this.parent.rightbottomdiv.scrollLeft = this.original_pos;            
        }
    }
   this.scroll = function(left,top) {
       this.rightbottomdiv.scrollTop = top;
       this.leftbottomdiv.scrollTop = top;
       this.rightbottomdiv.scrollLeft = left;
       this.righttopdiv.scrollLeft = left;
   }
   this.adjust_sizes = function() { 
        if (alat.lib.keys(this.values_rowid_dict).length>0) {
            //height correction
            for (var i=0; i<this.layout_table_values.childNodes.length; i++) {
                var vn = this.layout_table_values.childNodes[i];
                var yn = this.layout_table_y.childNodes[i];
                var newh = yn.clientHeight;
                if (vn.clientHeight>yn.clientHeight) {
                    newh = vn.clientHeight;
                }
                yn.style["height"]=newh+"px";
                vn.style["height"]=newh+"px";
                yn.style["minHeight"]=newh+"px";
                vn.style["minHeight"]=newh+"px";
                yn.style["maxHeight"]=newh+"px";
                vn.style["maxHeight"]=newh+"px";
            }
			//width correction
			var x_levels = this.layout_table_x.childNodes.length;
            for (var i=0; i<this.layout_table_values.childNodes[0].childNodes.length; i++) {
                var vn = this.get_cell_obj(i,0);
			    var xn = this.layout_table_x.childNodes[x_levels-1].childNodes[i];
                var neww = xn.clientWidth;
                if (vn.clientWidth>xn.clientWidth) {
                    neww = vn.clientWidth;
                }
                xn.style["width"]=neww+"px";
                vn.style["width"]=neww+"px";
                xn.style["minWidth"]=neww+"px";
                vn.style["minWidth"]=neww+"px";
                xn.style["maxWidth"]=neww+"px";
                vn.style["maxWidth"]=neww+"px";
			}
            m = this;
            lr = this.leftbottomdiv.childNodes[0].childNodes[0];
            rr = this.rightbottomdiv.childNodes[0].childNodes[0];
        }
    }
    // function refresh
    this.refresh = function() {
        // if empty return
        if (this.obj==null) {
            return;
        }
        var scrollbarsize = 13;
        var objh = this.obj.clientHeight;
        var xh = this.layout_table_x.clientHeight;
        var objw = this.obj.clientWidth;
        var yw = this.layout_table_y.clientWidth;

        this.leftbottomdiv.style["height"]=objh-xh-scrollbarsize+"px";
        this.leftbottomdiv.style["width"]=yw+"px";
        this.leftbottomdiv.style["left"]=0+"px";
        this.leftbottomdiv.style["top"]=xh+"px";

        this.righttopdiv.style["height"]=xh+"px";
        this.righttopdiv.style["width"]=objw-yw-scrollbarsize+"px";
        this.righttopdiv.style["left"]=yw+"px";
        this.righttopdiv.style["top"]=0+"px";
        
        this.rightbottomdiv.style["height"]=objh-xh-scrollbarsize+"px";
        this.rightbottomdiv.style["width"]=objw-yw-scrollbarsize+"px";
        this.rightbottomdiv.style["left"]=yw+"px";
        this.rightbottomdiv.style["top"]=xh+"px";

        // vertical scrollbar
        this.vscroll.size(scrollbarsize+"px",objh-xh-scrollbarsize+"px");
        this.vscroll.pos(objw-scrollbarsize+"px",xh+"px");
        this.vscroll.obj.style["height"]=objh-xh-scrollbarsize+"px";
        this.vscroll.refresh();
        // horizontal scrollbar
        this.hscroll.size(objw-yw-scrollbarsize+"px",scrollbarsize+"px");
        this.hscroll.pos(yw+"px",objh-scrollbarsize+"px");  
        this.hscroll.obj.style["width"]=objw-yw-scrollbarsize+"px";
        this.hscroll.refresh();
        /*
        console.log('On Matrix refresh:');
        console.log(' - Vertical - orig total:'+this.layout_table_y.offsetHeight+' orig size:'+this.leftbottomdiv.offsetHeight);
        console.log(' - Scrollbar data:');
        console.log('    - orig total:'+this.vscroll.original_total+' orig size:'+this.vscroll.original_size);
        console.log('    - offsetHeight:'+this.vscroll.obj.offsetHeight);
        console.log('    - scroll total:'+this.vscroll.scroll_total+' scroll size:'+this.vscroll.scroll_size);
		*/
    }
}


// ---------------
// Class Scrollbar
// ---------------
alat.gui.classic.Scrollbar = function(parent) {
    // GUIElement class inheritance
    alat.gui.classic.GUIElement.call(this,parent,alat.gui.classic.const.CLASS_SCROLLBAR);
    // function vertical
    this.vertical = function() {
        this.orientation = alat.gui.classic.const.ORIENTATION_VERTICAL;
    }
    // function horizontal
    this.horizontal = function() {
        this.orientation = alat.gui.classic.const.ORIENTATION_HORIZONTAL;
    }
    // function is_vertical
    this.is_vertical = function() {
        return this.orientation == alat.gui.classic.const.ORIENTATION_VERTICAL;
    }
    // function is_horizontal
    this.is_horizontal = function() {
        return this.orientation == alat.gui.classic.const.ORIENTATION_HORIZONTAL;
    }
    // default orientation
    this.vertical();
    // properties for original object
    this.original_total = 1;
    this.original_pos = 0;
    this.original_size = 1;
    // draw tag
    this.draw = function() {
        // outer div
        this.obj = document.createElement('div');
        this.obj.id = alat.manager.new_id();
        this.obj.parent_object = this;
        this.obj.hidden=false;
		this.add_class(this.obj,this.className);
        this.set_style("background-color","#CCC");
        //this.parent.obj.appendChild(this.obj);
        this.parent.add(this.obj);
        // inner div
        this.inner = document.createElement('div');
        this.inner.id = alat.manager.new_id();
        this.inner.parent_object = this;
        this.inner.hidden=false;
        this.inner.style["backgroundColor"]="#888";
        this.obj.appendChild(this.inner);
        // mouse events
        this.state = Object();
        this.state.drag = false;
        this.state.last_onmousemove = null;
        this.state.last_onmouseup = null;
        this.move = function(x,y) {
            if (this.is_vertical()) {
                var dy = y-this.state.origscreeny;
                var new_sc_pos = this.state.origdivy+dy;
                if (new_sc_pos<0) new_sc_pos=0;
                if (new_sc_pos>(this.scroll_total-this.scroll_size)) new_sc_pos = this.scroll_total-this.scroll_size;
                this.scroll_pos = new_sc_pos;
                this.inner.style['top']=new_sc_pos+'px';
                //console.log('Vertical move:'+new_sc_pos);
            } else {
                var dx = x-this.state.origscreenx;
                var new_sc_pos = this.state.origdivx+dx;
                if (new_sc_pos<0) new_sc_pos=0;
                if (new_sc_pos>(this.scroll_total-this.scroll_size)) new_sc_pos = this.scroll_total-this.scroll_size;
                this.scroll_pos = new_sc_pos;
                this.inner.style['left']=new_sc_pos+'px';                                
                //console.log('Horizontal move:'+new_sc_pos);
            }
            this.original_pos = this.scroll_pos * this.original_total / this.scroll_total;
            if (this.on_move) {
                this.on_move();
            }
        }
        this.obj.onmousedown = function(e) {
            var o = this.parent_object;
            if (e.button==0) {
                o.state.drag = true;
                o.state.origdivx = o.inner.offsetLeft;
                o.state.origdivy = o.inner.offsetTop;
                o.state.origscreenx = e.clientX;
                o.state.origscreeny = e.clientY;
                o.state.last_onmousemove = document.onmousemove;
                o.state.last_onmouseup = document.onmouseup;
                document.parent_object = o;
                document.onmousemove = o.onmousemove_callback;
                document.onmouseup = o.onmouseup_callback;
            }
        }
        this.onmouseup_callback = function(e) {
            var o = this.parent_object;
            if (e.button==0 && o.state.drag) {
                o.state.drag = false;
                document.onmousemove=o.state.last_onmousemove;
                document.onmouseup=o.state.last_onmouseup;
            }
        }
        this.onmousemove_callback = function(e) {
            var o = this.parent_object;
            if (e.button==0 && o.state.drag) {
                o.move(e.clientX,e.clientY);
                alat.gui.classic.deselectAll();
                alat.gui.classic.disabledEventPropagation(e);
                alat.gui.classic.preventEventDefault(e);
                return false;
            }
        }
    }
    // refresh
    this.refresh = function() { 
        if (this.obj==null) {
            return;
        }
        // call on_refresh
        if (this.on_refresh) {
            this.on_refresh();
        }
        // resize & repos
        if (this.is_vertical()) {
            var sc_total = this.obj.offsetHeight; 
            var sc_size = sc_total * this.original_size / this.original_total;
            var sc_pos = sc_total * this.original_pos / this.original_total;
            if (sc_size>sc_total) sc_size = sc_total;
            this.inner.style['position']='absolute';
            this.inner.style['width']=this.obj.offsetWidth+'px';
            this.inner.style['height']=sc_size+'px';
            this.inner.style['left']=0+'px';
            this.inner.style['top']=sc_pos+'px';
            this.scroll_size = sc_size;
            this.scroll_total = sc_total;
            this.scroll_pos = sc_pos;
            //console.log('On vert scrollbar refresh:'+this.original_total+':'+this.scroll_total);
        } else {
            var sc_total = this.obj.offsetWidth;
            var sc_size = sc_total * this.original_size / this.original_total;
            var sc_pos = sc_total * this.original_pos / this.original_total;
            if (sc_size>sc_total) sc_size = sc_total;
            this.inner.style['position']='absolute';
            this.inner.style['height']=this.obj.offsetHeight+'px';
            this.inner.style['width']=sc_size+'px';
            this.inner.style['top']=0+'px';
            this.inner.style['left']=sc_pos+'px';
            this.scroll_size = sc_size;
            this.scroll_total = sc_total;
            this.scroll_pos = sc_pos;
        }
    }
    // for override
    this.on_move = null;
    this.on_refresh = null;
}





// ----------
// Class Edit
// ----------
alat.gui.classic.Edit = function(parent,fieldname) {
    // GUIElement class inheritance
    alat.gui.classic.GUIElement.call(this,parent,alat.gui.classic.const.CLASS_EDIT);
	// fieldname property
    this.fieldname = fieldname;
	// on key down event handler
	this.on_key_down = function(event) {
		if ([40,38,33,34,114,115].indexOf(event.keyCode)!=-1) {
			var o = event.target.parent_object;
			o.block.gui_set(o.fieldname,o.block.calc_eval(o.obj.value));
		}
		// action
		if (event.keyCode == 13) {
			var o = event.target.parent_object;
			o.run_action();
		}
		alat.manager.current_block().gui_manager.on_key_down(event);
	}
	// draw tag
    this.draw = function() {
        // input tag 
        this.obj = document.createElement('input');
        this.obj.id = alat.manager.new_id();
        this.obj.parent_object = this;
        this.obj.hidden=false;
		this.add_class(this.obj,this.className);
		this.add_class(this.obj,"shadow");
        //this.parent.obj.appendChild(this.obj);
        this.parent.add(this.obj);
		// on change event
        this.obj.onchange = function(event) {
            var o = event.target.parent_object;  
            o.block.gui_set(o.fieldname,o.block.calc_eval(o.obj.value)); 
        }
		// on key down event
		this.obj.onkeydown = function(event) {
			var o = event.target.parent_object;o.on_key_down(event);
		}
        // on click event
        this.obj.onclick = function(event) {
            var o = event.target.parent_object;
            o.block.gui_manager.set_focus(o);
        }
		// on double click = action event
		this.obj.ondblclick = function(event) {
            var o = event.target.parent_object;
            o.block.gui_manager.set_focus(o);
			// action
			o.run_action();
		}
    }
	// run_action
	this.run_action = function() {
		d = {};
		d.fieldname = this.fieldname;
		if (this.action_name != null) {
			this.block.action(this.action_name,d);				
		} else {
			var f = this.block.buffer.fielddict[this.fieldname];
			this.block.action(f.action_name,d);
		}
	}
	// refresh
    this.refresh = function() {
		if (this.obj==null) {
			return;
		}
		this.obj.value = this.block.gui_get(this.fieldname);
        this.obj.readOnly = this.block.buffer.fielddict[this.fieldname].is_readonly();
    }
    // focus receive
    this.focus_receive = function() {
        this.block.gui_manager.current_focus = this;
        this.obj.focus();
        if (this.obj.select!=null) {
            this.obj.select();
        }
    }
    // focus next send
    this.focus_next_send = function(target) {
        if (target!=null) { 
            target.focus_next_receive(); 
        }
    }
    // focus prev send
    this.focus_prev_send = function(target) {
        if (target!=null) { 
            target.focus_prev_receive(); 
        }
    }
    // focus next receive
    this.focus_next_receive = function() {
        this.block.gui_manager.current_focus = this;
    }
    // focus prev receive
    this.focus_prev_receive = function() {
        this.block.gui_manager.current_focus = this;
    }
    // add to focuslist
    this.block.gui_manager.add2focus(this);
}


// -----------
// Class Label
// -----------
alat.gui.classic.Label = function(parent,label) {
    // GUIElement class inheritance
    alat.gui.classic.GUIElement.call(this,parent,alat.gui.classic.const.CLASS_LABEL);
	// label property
    this.label = label;
	// draw tag
    this.draw = function() {
        // p tag 
        this.obj = document.createElement('b');
        this.obj.id = alat.manager.new_id();
        this.obj.parent_object = this;
        this.obj.hidden=false;
		this.add_class(this.obj,this.className);
        this.obj.innerHTML = this.block.expr(this.label);
        //this.parent.obj.appendChild(this.obj);
        this.parent.add(this.obj);
    }
	// refresh
    this.refresh = function() { 
		if (this.obj==null) {
			return;
		}
		this.obj.innerHTML = this.block.expr(this.label); 
    }
}




// -----------
// Class Title
// -----------
alat.gui.classic.Title = function(parent,label,moving_element) {
    // GUIElement class inheritance
    alat.gui.classic.GUIElement.call(this,parent,alat.gui.classic.const.CLASS_TITLE);
    // label property
    this.label = label;
    this.moving_element = moving_element;
    // draw tag
    this.draw = function() {
        // p tag 
        this.obj = document.createElement('b');
        this.obj.id = alat.manager.new_id();
        this.obj.parent_object = this;
        this.obj.hidden=false;
        this.add_class(this.obj,this.className);
        //this.set_style("cursor","default");
        this.set_style("cursor","all-scroll");
        this.obj.innerHTML = this.block.expr(this.label);
        //this.parent.obj.appendChild(this.obj);
        this.parent.add(this.obj);
        // mouse
        this.state = Object();
        this.state.drag = false;
        this.state.last_onmousemove = null;
        this.state.last_onmouseup = null;        
        this.move = function(x,y) {
            var dx = x-this.state.origscreenx;
            var dy = y-this.state.origscreeny;
            var newx = this.state.origdivx+dx+"px";
            var newy = this.state.origdivy+dy+"px";
            //console.log('   - Target offset before:'+this.moving_element.obj.offsetLeft+','+this.moving_element.obj.offsetTop);
            this.moving_element.pos(newx,newy);
            this.moving_element.obj.style["left"]=newx;
            this.moving_element.obj.style["top"]=newy;
            //console.log(' - MOVE:'+x+','+y);
            //console.log('   - OrigOffset:'+this.state.origdivx+','+this.state.origdivy
            //    +' OrigScreen:'+this.state.origscreenx+','+this.state.origscreeny)
            //console.log('   - Newxy:'+newx+','+newy+' dxy:'+dx+','+dy)
            //console.log('   - Target offset:'+this.moving_element.obj.offsetLeft+','+this.moving_element.obj.offsetTop);
            //console.log('   - Title offset:'+this.obj.offsetLeft+','+this.obj.offsetTop);
        }
        this.obj.onmousedown = function(e) {
            var o = this.parent_object;
            if (e.button==0) {
                o.state.drag = true;
                o.state.origdivx = o.moving_element.obj.offsetLeft;
                o.state.origdivy = o.moving_element.obj.offsetTop;
                o.state.origscreenx = e.clientX;
                o.state.origscreeny = e.clientY;
                //console.log('onMouseDown:'+e.button+' '+e.clientX+','+e.clientY+' state:'+o.state.drag);
                //console.log(' - State:'+o.state.origdivx+','+o.state.origdivy);
                o.state.last_onmousemove = document.onmousemove;
                document.parent_object = o;
                document.onmousemove = o.onmousemove_callback;
                document.onmouseup = o.onmouseup_callback;   
                //o.moving_element.create_overlay();
                //console.log(' - document.onmousemove = '+document.onmousemove);
            }
        }
        this.onmouseup_callback = function(e) {
            var o = this.parent_object;
            if (e.button==0 && o.state.drag) {
                o.state.drag = false;
                document.onmousemove=o.state.last_onmousemove;
                document.onmouseup=o.state.last_onmouseup;
                //o.moving_element.remove_overlay();
            }
        }
        this.onmousemove_callback = function(e) {
            var o = this.parent_object;
            if (e.button==0 && o.state.drag) {
                //console.log('onMouseMove:'+e.button+' '+e.clientX+','+e.clientY+' state:'+o.state.drag);
                o.move(e.clientX,e.clientY);
                alat.gui.classic.deselectAll();
                //o.moving_element.refresh_overlay();
                // prevent selection text
                alat.gui.classic.disabledEventPropagation(e);
                alat.gui.classic.preventEventDefault(e);
                return false;
            }
        }
    }
    // refresh
    this.refresh = function() { 
        if (this.obj==null) {
            return;
        }
        this.obj.innerHTML = this.block.expr(this.label); 
    }
}




// ------------
// Class Button
// ------------
alat.gui.classic.Button = function(parent,label,action_name) {
    // GUIElement class inheritance
    alat.gui.classic.GUIElement.call(this,parent,alat.gui.classic.const.CLASS_BUTTON);
	// button label
    this.label = label;
	// action event name
    this.action_name = action_name;
	// draw tag
    this.draw = function() {
        // button tag 
        this.obj = document.createElement('button');
        this.obj.id = alat.manager.new_id();
        this.obj.parent_object = this;
        this.obj.hidden=false;
		this.add_class(this.obj,this.className);
		this.add_class(this.obj,"shadow");
        this.obj.innerHTML = this.block.expr(this.label);
        //this.parent.obj.appendChild(this.obj);
        this.parent.add(this.obj);
        this.obj.onclick = function(event) {
            var o = event.target.parent_object;  
            o.block.gui_manager.set_focus(o); 
            o.block.action(o.action_name); 
        }
    }
	// refresh
    this.refresh = function() { 
		if (this.obj==null) {
			return;
		}
		this.obj.innerHTML = this.block.expr(this.label); 
    }
    // focus receive
    this.focus_receive = function() {
        this.block.gui_manager.current_focus = this;
        if (this.obj != null) {
            this.obj.focus();
            if (this.obj.select!=null) {
                this.obj.select();
            }
        }
    }
    // focus next send
    this.focus_next_send = function(target) {
        if (target!=null) { 
            target.focus_next_receive(); 
        }
    }
    // focus prev send
    this.focus_prev_send = function(target) {
        if (target!=null) { 
            target.focus_prev_receive(); 
        }
    }
    // focus next receive
    this.focus_next_receive = function() {
        this.block.gui_manager.current_focus = this;
    }
    // focus prev receive
    this.focus_prev_receive = function() {
        this.block.gui_manager.current_focus = this;
    }
    // add to focuslist
    this.block.gui_manager.add2focus(this);
}




// ---------------------
// Class Manager
// GUI manager for block
// ---------------------
alat.gui.classic.Manager = function(block,parent_tag_id) {
	// class identification
    this.className = alat.gui.classic.const.CLASS_MANAGER;
	// parent block
	this.block = block;
	// attach to block
	this.block.gui_manager = this;
	// page size property for pgup/pgdown
	// to be changed by table
	this.page_size = 1;
    // focuslist property
    this.focuslist = [];
    // function add2focus
    this.add2focus = function(gui_element) {
        var i = this.focuslist.indexOf(gui_element);
        if (i==-1) {
            this.focuslist.push(gui_element);
        }
    }
    // current_focus property
    this.current_focus = null;
    // function set_focus:
    this.set_focus = function(gui_element) {
        if (gui_element!=null) {
            this.current_focus = gui_element;
        }
        if (this.current_focus != null && this.current_focus.obj != null) {
            this.current_focus.focus_receive();
        }
    }
    // function focus_first
    this.focus_first = function() {
		if (this.focuslist.length == 0) return;
        var target = this.focuslist[0];
        if (target!=null) {
            target.focus_next_receive();
        }
		//this.current_focus = this.focuslist[0];
    }
    // function focus_next
    this.focus_next = function() {
		if (this.focuslist.length == 0) return;
        var i = 0;
        if (this.current_focus!=null) {
            i = this.focuslist.indexOf(this.current_focus);
            i++;
            if (i>=this.focuslist.length) {
                i=0;
            }
        }
        var target = this.focuslist[i];
        if (this.current_focus!=null) {
            this.current_focus.focus_next_send(target);
        } else {
            target.focus_next_receive();
        }
		//this.current_focus = this.focuslist[i];
    }
    // function focus_prev
    this.focus_prev = function() {
		if (this.focuslist.length == 0) return;
        var i = this.focuslist.length-1;
        if (this.current_focus!=null) {
            i = this.focuslist.indexOf(this.current_focus);
            i--;
            if (i<0) {
                i=this.focuslist.length-1;
            }
        }
        var target = this.focuslist[i];
        if (this.current_focus!=null) {
            this.current_focus.focus_prev_send(target);
        } else {
            target.focus_prev_receive();
        }
		//this.current_focus = this.focuslist[i];
    }
	// obj property: parent object
	this.parent_tag_id = parent_tag_id
	if (parent_tag_id==null) {
		this.obj = document.body;
	} else {
		this.obj = document.getElementById(parent_tag_id);
	}
	// children object list
	this.childrenlist = [];
	// set grid unit width and height
    this.set_grid = function(width,height) {
        this.grid_width = width;
        this.grid_height = height;
    }
	// initial grid values
    this.set_grid(10,25);
	// set margin width and height
    this.set_margin = function(width,height) {
        this.margin_width = width;
        this.margin_height = height;
    }
	// initial margin values
    this.set_margin(5,5);
	// calculate x in grid unit width and margin to px
    this.gx2px = function(gx) {
        return Math.round(this.margin_width+gx*this.grid_width)+'px';
    }
	// calculate y in grid unit height and margin to px
    this.gy2px = function(gy) {
        return Math.round(this.margin_height+gy*this.grid_height)+'px';
    }
	this.on_key_down = function(event) {
		//var o = event.target.parent_object;	
		var b = alat.manager.current_block();
		// call ON KEY DOWN event handler
		// If false then doesnt handle keys bellow
		var retval = b.call_event(alat.const.EVENT_ON_KEY_DOWN,null,event.keyCode,event);
		if (event.keyCode==9) {
            //event.shiftKey
            //event.ctrlKey
            //event.altKey
            //event.metaKey
            if (event.shiftKey==true) {
                this.focus_prev();
				this.set_focus();
            } else {
                this.focus_next();
				this.set_focus();
            }
            alat.gui.classic.disabledEventPropagation(event);
			alat.gui.classic.preventEventDefault(event);
			return false
		}
		if (retval!=false) {
			if (event.keyCode==40) {
				b.goto_row(b.buffer.rowid,+1); 
				alat.gui.classic.disabledEventPropagation(event);
			} 
			if (event.keyCode==38) {
                b.goto_row(b.buffer.rowid,-1); 
				alat.gui.classic.disabledEventPropagation(event);
			} 
			if (event.keyCode==33) {
				b.goto_row_force(b.buffer.rowid,-b.gui_manager.page_size); 
				alat.gui.classic.disabledEventPropagation(event);
			} 
			if (event.keyCode==34) {
				b.goto_row_force(b.buffer.rowid,+b.gui_manager.page_size); 
				alat.gui.classic.disabledEventPropagation(event);
			}
       		if (event.keyCode==114) {   
                b.delete_row();
				alat.gui.classic.disabledEventPropagation(event);
                alat.gui.classic.preventEventDefault(event);
                return false
            }
            if (event.keyCode==115) {
                b.insert_row();
				alat.gui.classic.disabledEventPropagation(event);
                alat.gui.classic.preventEventDefault(event);
                return false
            }		
            if (event.keyCode==27 && b.parent) {
                b.close_block();
                alat.gui.classic.disabledEventPropagation(event);
                alat.gui.classic.preventEventDefault(event);
                return false
            }       
			alat.gui.classic.disabledEventPropagation(event);
		} else {
			alat.gui.classic.disabledEventPropagation(event);
			alat.gui.classic.preventEventDefault(event);
			return false
		}
	}
    // Function add: add child tag to apropriate tag
    this.add = function(tag_obj) {
        this.obj.appendChild(tag_obj);
    }
    // function refresh_all: refresh state of all gui elements in block
    this.refresh_all = function() {
        for (var i in this.childrenlist) {
            this.childrenlist[i].refresh_all();
        }
        if (this.current_focus == null) {
            this.focus_first();
        }
		// Current focus point
        if (this.block.count_rows()>0 || this.block.buffer.multicount==0) {
            this.set_focus(); // current focus
        }
    }
    // drawn property
    this.drawn = false;
    // function clear_all
    this.clear_all = function() {
        //this.obj.innerHTML = "";  // Old code
        for (var i in this.childrenlist) {
            this.childrenlist[i].clear();
            //if (this.childrenlist[i].obj) {
            //    var e = this.childrenlist[i].obj;
            //    e.parentNode.removeChild(e);
            //}
        }
        this.drawn = false;
    }
    // function draw_all: draw all childs
	this.draw_all = function() {
        this.clear_all();
        // draw
        for (var i in this.childrenlist) {
            this.childrenlist[i].draw_all();
        }
        // set drawn property
        this.drawn = true;
		// redefine document.onkeydown event - call this.on_key_down(event)
		document.onkeydown = function(event) {
			alat.manager.current_block().gui_manager.on_key_down(event);
		}
	}
	// function: create_overlay_all: create overlays for all children
	this.create_overlay_all = function() {
        for (var i in this.childrenlist) {
            this.childrenlist[i].create_overlay_all();
        }
    }
    // function: remove_overlay_all: remove overlays for all children
    this.remove_overlay_all = function() {
        for (var i in this.childrenlist) {
            this.childrenlist[i].remove_overlay_all();
        }
    }
    // function: refresh_overlay_all: refresh overlays for all children
    this.refresh_overlay_all = function() {
        for (var i in this.childrenlist) {
            this.childrenlist[i].refresh_overlay_all();
        }
    }	
}









