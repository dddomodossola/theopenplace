iconsetRoot = "";
guiFontFamily = "verdana,helvetica,arial,sans-serif";


iconsetCloseIcon = iconsetRoot + "close_icon.png"; 

//list of objects to be updated on gui changes
guiUpdateArray = new Array();

/*****************************utility functions********************************/
function safeParseInt(str){
  var num = parseInt(str);
  if( isNaN(num) )
    return 0;
    
  return num;
}

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

function getW( dom_element ){
  return parseInt(dom_element.style.width);
}
function getH( dom_element ){
  return parseInt(dom_element.style.height);
}

//gui update append object to updatable list
//every updatable object register itself
function guiAddUpdater(obj){
	guiUpdateArray[guiUpdateArray.length]=obj;
}
//perform a gui update
function guiUpdate(){
  var i;
	for(i in guiUpdateArray){
		guiUpdateArray[i].update();
	}
}

function spacePartitioner( reqSpaceArray, availableSpace ){
  var outAssignedSpace = new Array();
  var spaceToAssign = availableSpace;
  var spaceRequiredTot = 0;
  for( i in reqSpaceArray ){
    spaceRequiredTot = spaceRequiredTot + reqSpaceArray[i];
  }
  if(spaceRequiredTot==0)
    spaceRequiredTot = 1; 
  for( i in reqSpaceArray ){
    outAssignedSpace[i] = reqSpaceArray[i]*spaceToAssign/spaceRequiredTot; //array[i]:spaceRequiredTot=x:spaceToAssign
  }
  return outAssignedSpace;
}  

function toPix(val){
  return parseInt(val) + "px";
}

function styledDiv(title,x,y,width,height,zIndex){
  var div = document.createElement("div");
  div.style.position = "absolute";
  if( x >= 0 )div.style.left = toPix(x);
  if( x < 0 )div.style.right = toPix(-x);
  if( y >= 0 )div.style.top = toPix(y);
  if( y < 0 )div.style.bottom = toPix(-y);
  div.style.width = toPix(width);
  div.style.height = toPix(height);
  div.style.backgroundColor = "transparent";
  div.style.zIndex = zIndex;
  div.style.display = "block";
  div.style.fontFamily = guiFontFamily;
  div.title = title;
  return div
}

function appendChildToParent( parent, child ){
  parent.appendChild( child );
  child.parent = parent;
}



/*****************************class GUIPanel************************************/
/* 	title as string 			example "title"
	dom_container				ex		document.body
	x y width height in pixel	ex 		0, 0, 100, 100
	zIndex						ex		1
*/
function GUIPanel( title, dom_container, x, y, width, height, zIndex ){
  this.m_div = styledDiv(title,x,y,width,height,zIndex);
  //this.m_div.style.border = "2px solid #ffffff";
  this.m_div.style.backgroundColor = "#fff";
  this.m_div.style.border = "1px solid #ebebeb";
  
  /*var colorRightTop = "#ffffff";
  var colorLeftBottom = "#F1F1DE";
  // IE10 Consumer Preview 
  this.m_div.style.backgroundImage = "-ms-linear-gradient(top right, " + colorRightTop + " 0%, " + colorLeftBottom + " 100%)";
  // Mozilla Firefox
  this.m_div.style.backgroundImage = "-moz-linear-gradient(top right, " + colorRightTop + " 0%, " + colorLeftBottom + " 100%)";
  // Opera 
  this.m_div.style.backgroundImage = "-o-linear-gradient(top right, " + colorRightTop + " 0%, " + colorLeftBottom + " 100%)";
  // Webkit (Safari/Chrome 10) 
  this.m_div.style.backgroundImage = "-webkit-gradient(linear, right top, left bottom, color-stop(0, " + colorRightTop + "), color-stop(1, " + colorLeftBottom + "))";
  // Webkit (Chrome 11+) 
  this.m_div.style.backgroundImage = "-webkit-linear-gradient(top right, " + colorRightTop + " 0%, " + colorLeftBottom + " 100%)";
  // W3C Markup, IE10 Release Preview 
  this.m_div.style.backgroundImage = "linear-gradient(to bottom left, " + colorRightTop + " 0%, " + colorLeftBottom + " 100%)";
  */
  
  dom_container.appendChild(this.m_div);
}

GUIPanel.prototype.appendDecorations = function() {
  //controls
  
  //close button
  this.m_div.m_controls = new Object();
  var tmp = this.m_div.m_controls.m_closeButton = styledDiv("close",0,10,25,25,1);
  tmp.style.left = null;
  tmp.style.right = toPix(10);
  tmp.style.backgroundColor = "red";
  tmp.style.cursor = "pointer";
  tmp.style.backgroundRepeat = "no-repeat";
  tmp.style.backgroundImage = "url('" + iconsetCloseIcon + "')";
  tmp.style.zIndex = 3;
  tmp.style.opacity = "0.5";
  tmp.style.minWidth = toPix(25);
  tmp.style.minHeight = toPix(25);
  appendChildToParent( this.m_div, this.m_div.m_controls.m_closeButton );
  
  this.initEvents();
}


GUIPanel.prototype.hide = function() {
  this.m_div.style.display = "none";
}
GUIPanel.prototype.show = function() {
  this.m_div.style.display = "block";
}

GUIPanel.prototype.closeBtEvclose = function() {
  this.parent.style.display = "none";
}
GUIPanel.prototype.closeBtEvshow = function() {
  this.parent.style.display = "block";
}
GUIPanel.prototype.closeBtEvhover = function() {
  this.style.opacity = "1.0";
}
GUIPanel.prototype.closeBtEvleave = function() {
  this.style.opacity = "0.5";
}
GUIPanel.prototype.initEvents = function() {
  this.m_div.m_controls.m_closeButton.onclick = this.closeBtEvclose;
  this.m_div.m_controls.m_closeButton.onmouseover = this.closeBtEvhover;
  this.m_div.m_controls.m_closeButton.onmouseout = this.closeBtEvleave;
}



/*****************************class GUIVBoxLayout************************************/
/*	dom_container				ex		panel.m_div
    usePartitioner      se true permette la suddivisione proporzionale dello spazio
                        se false ogni elemento aggiunto al layout usa lo spazio che gli serve fino ad un massimo di spazio suddiviso proporzionalmente
*/
function GUIVBoxLayout(container,usePartitioner){
  this.m_div = styledDiv(null,0,0,safeParseInt(container.style.width),safeParseInt(container.style.height),1);
  appendChildToParent( container, this.m_div );
  this.m_container = container;
  this.m_children = new Array();
  this.m_usePartitioner = usePartitioner;
  container.layout = this;
  guiAddUpdater( this );
}

GUIVBoxLayout.prototype.clean = function(){
  var prev = null;
  while(this.m_children.length>0)this.m_div.removeChild( this.m_children.pop().m_div );
  this.assignSpace(this.m_usePartitioner);
  guiUpdate();
}

GUIVBoxLayout.prototype.append = function(content){
  var prev = null;
  if( this.m_children.length > 0 )
    prev = this.m_children[this.m_children.length-1];

  var layoutElement = new GUIVBoxContainer( this.m_div, content, prev );
  this.m_children[this.m_children.length] = layoutElement;
  
  this.assignSpace(this.m_usePartitioner);
  
  guiUpdate();
}

GUIVBoxLayout.prototype.assignSpace = function(usePartitioner){
  var heights = new Array();
  for( i in this.m_children ){
    heights[i] = safeParseInt( this.m_children[i].m_content.style.height );
  }   
  var assignedHeights = spacePartitioner( heights, safeParseInt(this.m_div.style.height) );
  for( i in assignedHeights ){
    this.m_children[i].m_div.style.height = toPix( assignedHeights[i] );
    
    if( usePartitioner == false ){
      this.m_children[i].m_div.style.height = toPix(safeParseInt(this.m_children[i].m_content.style.height)+2); //toPix( (assignedHeights[i]>parseInt(this.m_children[i].m_content.style.height)?this.m_children[i].m_content.style.height:assignedHeights[i]) );
    }      
  }
  this.doStretch();
}

GUIVBoxLayout.prototype.appendSpacer = function(size){
  this.append( styledDiv(null,0,0,size,size,1) );
}
GUIVBoxLayout.prototype.appendStretch = function(){
  if( this.m_usePartitioner==true )
    return;
    
  var stretch = styledDiv(null,0,0,1,1,1);
  stretch.stretch = true;
  this.append( stretch );
}

GUIVBoxLayout.prototype.doStretch = function(){
  var elementsSize = 0;
  var stretchNum = 0;
  for( i in this.m_children ){
    if( "stretch" in this.m_children[i].m_content ){
      stretchNum = stretchNum + 1;
    }else{
      elementsSize = elementsSize + safeParseInt( this.m_children[i].m_content.style.height )+2;
    }
  }
  if(stretchNum==0)
    return;
  
  var stretchSize = (safeParseInt(this.m_div.style.height)-elementsSize)/stretchNum;
  for( i in this.m_children ){
    if( "stretch" in this.m_children[i].m_content ){
      this.m_children[i].m_div.style.height = toPix(stretchSize);
    }
  }
}

GUIVBoxLayout.prototype.update = function(){
  this.m_div.style.width = toPix(safeParseInt(this.m_container.style.width));
  this.m_div.style.height = toPix(safeParseInt(this.m_container.style.height));
  this.assignSpace(this.m_usePartitioner);
}

/*****************************class GUIVBoxContainer************************************/
/*	container the layout div				ex		layout.m_div
	content	the dom object to append		ex		document.createElement("div")
	previous a GUIVBoxContainer	to determinize the y position of the new content
*/
function GUIVBoxContainer(container,content,previous){
  this.m_previous = previous;
  this.m_div = styledDiv(null,0,0,1,1,1);
  this.m_div.style.overflow = "hidden";
  this.m_content = content;                                        
  appendChildToParent( this.m_div, content );
  appendChildToParent( container, this.m_div );
  guiAddUpdater( this );
}

GUIVBoxContainer.prototype.update = function(){
  var parent = this.m_div.parent;
  
  if(this.m_previous==null){
    this.m_div.style.top = toPix(0);
  }else{
    this.m_div.style.top = toPix(safeParseInt(this.m_previous.m_div.style.top)+safeParseInt(this.m_previous.m_div.style.height));
  }
  //this.m_div.style.height = toPix( (parseInt(parent.style.height))/(parent.children.length) );
  this.m_div.style.left = toPix(0);
  this.m_div.style.width = parent.style.width;
  
  this.m_content.style.maxWidth = this.m_div.style.width;
  var margin = (safeParseInt(this.m_div.style.width)-safeParseInt(this.m_content.style.width))/2;
  margin = (margin<0)?0:margin;
  this.m_content.style.marginLeft = this.m_content.style.marginRight = toPix(margin);
  this.m_content.style.maxHeight = this.m_div.style.height;
  margin = (safeParseInt(this.m_div.style.height)-safeParseInt(this.m_content.style.height))/2-1;
  margin = (margin<0)?0:margin;
  this.m_content.style.marginTop = this.m_content.style.marginBottom = toPix(margin);
}



/*****************************class GUIHBoxLayout************************************/
/*	dom_container				ex		panel.m_div
    usePartitioner      se true permette la suddivisione proporzionale dello spazio
                        se false ogni elemento aggiunto al layout usa lo spazio che gli serve fino ad un massimo di spazio suddiviso proporzionalmente
*/
function GUIHBoxLayout(container,usePartitioner){
  this.m_div = styledDiv(null,0,0,safeParseInt(container.style.width),safeParseInt(container.style.height),1);
  appendChildToParent( container, this.m_div );
  this.m_container = container;
  this.m_children = new Array();
  this.m_usePartitioner = usePartitioner;
  container.layout = this;
  guiAddUpdater( this );
}

GUIHBoxLayout.prototype.clean = function(){
  var prev = null;
  while(this.m_children.length>0)this.m_div.removeChild( this.m_children.pop().m_div );
  this.assignSpace(this.m_usePartitioner);
  guiUpdate();
}

GUIHBoxLayout.prototype.append = function(content){
  var prev = null;
  if( this.m_children.length > 0 )
    prev = this.m_children[this.m_children.length-1];

  var layoutElement = new GUIHBoxContainer( this.m_div, content, prev );
  this.m_children[this.m_children.length] = layoutElement;
  
  this.assignSpace(this.m_usePartitioner);
  
  guiUpdate();
}

GUIHBoxLayout.prototype.assignSpace = function(usePartitioner){
  var widths = new Array();
  for( i in this.m_children ){
    widths[i] = safeParseInt( this.m_children[i].m_content.style.width );
  }   
  var assignedWidths = spacePartitioner( widths, safeParseInt(this.m_div.style.width) );
  for( i in assignedWidths ){
    this.m_children[i].m_div.style.width = toPix( assignedWidths[i] );
    
    if( usePartitioner == false ){
      this.m_children[i].m_div.style.width = toPix(safeParseInt(this.m_children[i].m_content.style.width)+2); //toPix( (assignedWidths[i]>parseInt(this.m_children[i].m_content.style.width)?this.m_children[i].m_content.style.width:assignedWidths[i]) );
   }
  }
  this.doStretch();
}

GUIHBoxLayout.prototype.appendSpacer = function(size){
  this.append( styledDiv(null,0,0,size,size,1) );
}
GUIHBoxLayout.prototype.appendStretch = function(){
  if( this.m_usePartitioner==true )
    return;
    
  var stretch = styledDiv(null,0,0,1,1,1);
  stretch.stretch = true;
  this.append( stretch );
}

GUIHBoxLayout.prototype.doStretch = function(){
  var elementsSize = 0;
  var stretchNum = 0;
  for( i in this.m_children ){
    if( "stretch" in this.m_children[i].m_content ){
      stretchNum = stretchNum + 1;
    }else{
      elementsSize = elementsSize + safeParseInt( this.m_children[i].m_content.style.width )+2;
    }
  }
  if(stretchNum==0)
    return;
  
  var stretchSize = (safeParseInt(this.m_div.style.width)-elementsSize)/stretchNum;
  for( i in this.m_children ){
    if( "stretch" in this.m_children[i].m_content ){
      this.m_children[i].m_div.style.width = toPix(stretchSize);
    }
  }
}

GUIHBoxLayout.prototype.update = function(){
  this.m_div.style.width = toPix(safeParseInt(this.m_container.style.width));
  this.m_div.style.height = toPix(safeParseInt(this.m_container.style.height));
  this.assignSpace(this.m_usePartitioner);
}

/*****************************class GUIHBoxContainer************************************/
/*	container the layout div				ex		layout.m_div
	content	the dom object to append		ex		document.createElement("div")
	previous a GUIVBoxContainer	to determinize the x position of the new content
*/
function GUIHBoxContainer(container,content,previous){
  this.m_previous = previous;
  this.m_div = styledDiv(null,0,0,1,1,1);
  this.m_div.style.overflow = "hidden";
  this.m_content = content;
  appendChildToParent( this.m_div, content );
  appendChildToParent( container, this.m_div );
  guiAddUpdater( this );
}

GUIHBoxContainer.prototype.update = function(){
  var parent = this.m_div.parent;
  
  if(this.m_previous==null){
    this.m_div.style.left = toPix(0);
  }else{
    this.m_div.style.left = toPix(safeParseInt(this.m_previous.m_div.style.left)+safeParseInt(this.m_previous.m_div.style.width));
  }
  //this.m_div.style.width = toPix( (parseInt(parent.style.width))/(parent.children.length) );
  this.m_div.style.top = toPix(0);
  this.m_div.style.height = parent.style.height;
  
  this.m_content.style.maxWidth = this.m_div.style.width;
  var margin = (safeParseInt(this.m_div.style.width)-safeParseInt(this.m_content.style.width))/2-1;
  margin = (margin<0)?0:margin;
  this.m_content.style.marginLeft = this.m_content.style.marginRight = toPix(margin);
  this.m_content.style.maxHeight = this.m_div.style.height;
  margin = (safeParseInt(this.m_div.style.height)-safeParseInt(this.m_content.style.height))/2;
  margin = (margin<0)?0:margin;
  this.m_content.style.marginTop = this.m_content.style.marginBottom = toPix(margin);
}




/******************************GUIDataUpdater****************************
 */
function GUIDataUpdater(jsonreq,jsonargs){
  this.m_jsonreq = jsonreq;
  this.m_jsonargs = jsonargs;
  this.m_updaterArray = new Array();
  this.m_updateWaitState = false;
  this.m_waitCount = 0;
  this.testTime = 0;
}
GUIDataUpdater.prototype.append = function(domobj,domdatafield,jsondatafield){
  this.m_updaterArray[this.m_updaterArray.length] = new Array();
  this.m_updaterArray[this.m_updaterArray.length-1].m_domfield = domdatafield;
  this.m_updaterArray[this.m_updaterArray.length-1].m_jsonfield = jsondatafield;
  this.m_updaterArray[this.m_updaterArray.length-1].m_domobject = domobj;
}
GUIDataUpdater.prototype.appendProcessor = function(domobj,domdatafield,jsondatafield,processorFunction){
  this.m_updaterArray[this.m_updaterArray.length] = new Array();
  this.m_updaterArray[this.m_updaterArray.length-1].m_domfield = domdatafield;
  this.m_updaterArray[this.m_updaterArray.length-1].m_jsonfield = jsondatafield;
  this.m_updaterArray[this.m_updaterArray.length-1].m_domobject = domobj;
  this.m_updaterArray[this.m_updaterArray.length-1].m_processorFunction = processorFunction;
}
GUIDataUpdater.prototype.applyNewData = function(data){
	this.m_updateWaitState = false;
	console.debug( "new update response after: " + ((new Date()).getTime() - this.testTime) + "  for request: " + this.m_jsonreq );
	if( this.m_lastData == data )return;
		
	if(data==null)return;	

	this.m_lastData = data;
	
	data = JSON.parse(data);
	
	if( data == null )return;
	
	for( i=0; i<this.m_updaterArray.length; i++ ){
		if( this.m_updaterArray[i].m_processorFunction == null ){
			if( this.m_updaterArray[i].m_jsonfield in data ){
				//console.debug("GUIDataUpdater - updating domfield: " + _this.m_updaterArray[i].m_domfield + " from jsonfield: " + _this.m_updaterArray[i].m_jsonfield);
				//console.debug( data[_this.m_updaterArray[i].m_jsonfield] );
		
				this.m_updaterArray[i].m_domobject[this.m_updaterArray[i].m_domfield] = data[this.m_updaterArray[i].m_jsonfield];
			}else{
			  //alert("GUIDataUpdater - from json query get: " + _this.req + " error - no field: " + _this.m_updaterArray[i].m_jsonfield + " found.");
			  console.debug("GUIDataUpdater - from json query get: " + this.req + " error - no field: " + this.m_updaterArray[i].m_jsonfield + " found." );
			}
		}else{
			this.m_updaterArray[i].m_processorFunction( this.m_updaterArray[i].m_domobject, this.m_updaterArray[i].m_domfield, this.m_updaterArray[i].m_jsonfield, data );
		}
	}
}
GUIDataUpdater.prototype.update = function(jsonargs){
   
  if( this.m_updateWaitState ){
	console.debug("GUIDataUpdater - busy: " + this.m_waitCount + "   asfa: " + this.m_updaterArray.length );
    this.m_waitCount = this.m_waitCount + 1;
    if( this.m_waitCount > 10 )
      this.m_updateWaitState = false;
    return;
  }
  
  
  this.m_waitCount = 0;
  this.m_updateWaitState = true;
  if( jsonargs!= null )
	this.m_jsonargs = jsonargs;
  var req = this.m_jsonreq;
  for( i in this.m_jsonargs ){
    if( req[req.length-1] != '/' ){
      req = req + '/';
    }
    req = req + this.m_jsonargs[i];
  }
  //console.debug("GUIDataUpdater - json req args: " + this.m_jsonargs );
  //console.debug("GUIDataUpdater - json req: " + req );
  //console.debug("field to update: " + this.m_updaterArray.length );
  this.req = req;
  var _this = this;
  $.get(req ,function(data){_this.applyNewData(data);}); 
  this.testTime = (new Date()).getTime();
}
GUIDataUpdater.prototype.pulsar = function(){
  this.update( this.m_jsonargs );
}
GUIDataUpdater.prototype.stop = function(){
  clearTimeout(this.m_timer);
}
GUIDataUpdater.prototype.spontaneus = function(msec_interval){
  if( this.m_timer != 0 ) clearTimeout(this.m_timer);
  var _this = this;
  var fct = function(){ _this.pulsar(); };
  this.m_timer = setInterval( fct , msec_interval );
}




/*****************************Progress loading**************************/
function GUIProgress(size, container){
  this.m_size = size;
  this.m_container = container;
  this.m_dom = document.createElement("canvas");
  this.m_dom.width = "" + size;
  this.m_dom.height = "" + size;
  this.m_dom.style.width = toPix(size);
  this.m_dom.style.height = toPix(size);
  this.m_dom.style.position = "absolute";
  this.m_dom.style.left = "10px";
  this.m_dom.style.top = "10px";
  this.m_dom.style.zIndex = 5;
  this.m_interval = 50;
  this.m_step = 0;
  var _this = this;
  this.m_timer = setInterval( function(){ _this.pulsar(); }, this.m_interval );
  
  appendChildToParent( container, this.m_dom );
}
GUIProgress.prototype.pulsar = function(){
  var ctx=this.m_dom.getContext("2d");
  var writePoints = new Array();
  //center 41, 28
  var cx = 41;
  var cy = 28;
  writePoints[0] = new Object();
  writePoints[0].x = 4;
  writePoints[0].y = 47;
  writePoints[0].r = 4;
  writePoints[0].c = "#1188ff";
  writePoints[0].innerc = "#1188ff";
  writePoints[0].innerR = 1;
  writePoints[1] = new Object();
  writePoints[1].x = 18;
  writePoints[1].y = 50;
  writePoints[1].r = 6;
  writePoints[1].c = "#1188ff";
  writePoints[1].innerc = "#1188ff";
  writePoints[1].innerR = 1;
  writePoints[2] = new Object();
  writePoints[2].x = 41;
  writePoints[2].y = 44;
  writePoints[2].r = 10;
  writePoints[2].c = "#1188ff";
  writePoints[2].innerc = "#1188ff";
  writePoints[2].innerR = 1;
  writePoints[3] = new Object();
  writePoints[3].x = 67;
  writePoints[3].y = 16;
  writePoints[3].r = 15;
  writePoints[3].c = "#ff2592";
  writePoints[3].innerc = "#ffffff";
  writePoints[3].innerR = 11;
  writePoints[4] = new Object();
  writePoints[4].x = 67;
  writePoints[4].y = 16;
  writePoints[4].r = 15;
  writePoints[4].c = "#ff2592";
  writePoints[4].innerc = "#ffffff";
  writePoints[4].innerR = 11;
  
  if( this.m_step==1 ){
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,this.m_size, this.m_size);
  }
  if( this.m_step > 49 ){
    this.m_step=0;
  }

  
  
  var step = parseInt((this.m_step)/10);
  var substep = parseInt((this.m_step)%10);
  
  var ofx = this.m_size/2-cx;
  var ofy = this.m_size/2-cy;
  
  ctx.fillStyle = writePoints[step].c;
  ctx.beginPath();
  ctx.arc( writePoints[step].x + ofx, writePoints[step].y + ofy, writePoints[step].r*substep/10, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
  
  ctx.fillStyle = writePoints[step].innerc;
  ctx.beginPath();
  ctx.arc( writePoints[step].x + ofx, writePoints[step].y + ofy, writePoints[step].innerR*substep/10, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
  
  this.m_step+=1;
}
GUIProgress.prototype.stop = function(){
  clearTimeout( this.m_timer );
  this.m_dom.style.display = "none";
}

/*****************************test suite********************************/
/*function test(){
    chatPanel();  
}

function chatPanel(){
  panel = new GUIPanel("chatPanel",document.body,-1,-1,250,400,3);
  main_lay = new GUIVBoxLayout(panel.m_div, false);
  
  friend_info = styledDiv("friend_info_chat",0,0,230,35,1);
  friend_info_lay = new GUIHBoxLayout(friend_info, true);
  
  friend_avatar = document.createElement("img");
  friend_avatar.src = "http://localhost/img/profile_template.png",
  friend_avatar.style.width = "25px";
  friend_avatar.style.height = "25px";
  friend_info_lay.append( friend_avatar );
  
  friend_nick = styledDiv("friend_nick",0,0,185,25,1);
  friend_nick.innerHTML = "Pucciotto";
  friend_info_lay.append( friend_nick );
  
  
  msg = styledDiv("msg",0,0,220,40,1);
  msg_lay = new GUIVBoxLayout(msg, false);
  msg_content = styledDiv("msg content",0,0,250,20,1);
  msg_content.style.fontSize = "12px";
  msg_content.innerHTML = "contenuto del messaggio";
  msg_info = styledDiv("msg info",0,0,220,20,1);
  msg_info.style.fontSize = "10px";
  msg_info.innerHTML = "20-03-2013";
  msg_lay.append( msg_content );
  msg_lay.append( msg_info );
  
  //<input onfocus="searchfield_focus(this)" style="" type="text" id="as_q" name="as_q" value="Search w3schools.com">
  input = document.createElement("input");
  input.type = "text";
  input.value= "Type your message here";
  input.style.width = "250px";
  input.style.height = "20px";
  input.style.margin = "0px";
  input.style.padding = "0px";
  
  main_lay.append( friend_info );
  //main_lay.appendSpacer( 20 );
  main_lay.append( msg );
  main_lay.appendStretch();
  main_lay.append( input );
}
*/


