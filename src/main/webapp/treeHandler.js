function Node(label, fils) {
	this.label = label;
	this.fils = fils;
	this.isVisible = false;
	this.isClass = false;
	this.superClass = null;
	this.showMetadata = false;
	this.showSelectionArea=false;
	this.showUpdate=false;
	this.showInsert=false;
	this.showObjects=false;
	this.fields = null;
	this.fqn = "Package list";
}
function Field() {
	this.name = "";
	this.type = false;
	this.isPublic = false;
	this.isPrivate = false;
	this.isProtected = false;
	this.isStatic = false;
	this.isFinal = false;
	this.isInherited=false;
	this.isPk=false;
}
var listRoot = new Node("Package list", null);
listRoot.isVisible = true;
var jsonObjectsList;
var doc = "";

function start() {
	$.ajax({
		url : 'ClassListing',
		dataType : 'json',
		// data: data,
		timeout : 3000,
		success : function(feed) {
			var x = feed;
			// document.writeln("start");
			json2node(x, listRoot);
			// document.writeln("json2node success");
			generateFqn(listRoot);
			// document.writeln("generateFqn success");
			// doc+="<ul>";
			/*
			 * if (listRoot.fils != undefined && listRoot.fils != null) { if
			 * (listRoot.fils.length != undefined && listRoot.fils.length !=
			 * null) { for (i = 0; i < listRoot.fils.length; i++)
			 * listRoot.fils[i].isVisible = true; } else listRoot.fils.isVisible =
			 * true; }
			 */
			doc = view(listRoot, doc);
			//alert(doc);
			// alert("doc:"+doc);
			// doc+="<li>";
			// doc+="</ul>";
			// document.writeln("view success");
			// alert(doc);
		//	window.document.list=doc;
			showNewPage(doc);
//			document.getElementById("list").innerHTML= doc;
			// var h=document.getElementById("myHeader");
			 //x=doc;
			// alert(x.innerHTML);
		//	var r=document.getElementById('list');r.innerHTML= doc;
		//	document.
			// document.write(list);

		}
	});
}

function getNodeByName(root, nodeName) {
	if (nodeName == root.fqn)
		return root;
	if (root.fils != undefined && root.fils != null) {
		if (root.fils.length != undefined && root.fils.length != null
				&& root.fils.length > 0) {
			var i = 0;
			while (i < root.fils.length) {
				var res = getNodeByName(root.fils[i], nodeName);
				if (res != undefined && res != null)
					return res;
				i++;
			}
		} else
			return getNodeByName(root.fils, nodeName);
	}
	return null;
}
function generateFqn(root) { // root is a Node
	if (root.fils != undefined && root.fils != null) {
		if (root.fils.length != undefined && root.fils.length != null
				&& root.fils.length > 0) {
			var i = 0;
			while (i < root.fils.length) {
				if (root.fqn != "Package list")
					root.fils[i].fqn = root.fqn + "." + root.fils[i].label;
				else
					root.fils[i].fqn = root.fils[i].label;
				generateFqn(root.fils[i]);
				i++;
			}
		} else {
			if (root.fqn != "Package list")
				root.fils.fqn = root.fqn + "." + root.fils.label;
			else
				root.fils.fqn = root.fils.label;
			generateFqn(root.fils);
		}
	}
	return;
}

function json2node(root, node) { // root is a Json Object , node is a Node
	if (root.label != undefined && root.label != null) {
		node.label = root.label;
		if (root.isClass != undefined && root.isClass != null
				&& root.isClass == "true") {
			node.superClass=root.superClass;
			var tmp=node.label.split("\.");
			if(tmp.length>0) node.label=tmp[tmp.length-1];
			node.isClass = true;
			if (root.fields != undefined && root.fields != null) {
				if (root.fields.length != undefined
						&& root.fields.length != null && root.fields.length > 0) {
					// the class has many fields, so parsing them all
					var fields = new Array(root.fields.length);
					for (i = 0; i < root.fields.length; i++) {
						var field = new Field();
						field.name = root.fields[i].name;
						field.type = root.fields[i].type;
						field.isPublic = root.fields[i].isPublic;
						field.isPrivate = root.fields[i].isPrivate;
						field.isProtected = root.fields[i].isProtected;
						field.isStatic = root.fields[i].isStatic;
						field.isFinal = root.fields[i].isFinal;
						field.isInherited = root.fields[i].isInherited;
						field.isPk=root.fields[i].isPk;
						fields[i] = field;
						// alert(field.name+" "+"isPublic "+field.isPublic)
					}
					node.fields = fields;
				} else {
					var fields = new Array(1);
					var field = new Field();
					field.name = root.fields.name;
					field.type = root.fields.type;
					field.isPublic = root.fields.isPublic;
					field.isPrivate = root.fields.isPrivate;
					field.isProtected = root.fields.isProtected;
					field.isStatic = root.fields.isStatic;
					field.isFinal = root.fields.isFinal;
					field.isInherited = root.fields.isInherited;
					field.isPk=root.fields.isPk;
					fields[0] = field;
					node.fields = fields;
				}
			}
		}
	}
	// cas d_un arbre donc affichage des noeuds
	if (root.children != undefined && root.children != null) {
		if (root.children.length != undefined && root.children.length != null
				&& root.children.length > 0) {
			var pfils = new Array(root.children.length);
			var j = 0;
			// c une suite d_elements , donc affichage un par un
			for (j = 0; j < root.children.length; j++) {
				var ssNode = new Node();
				json2node(root.children[j], ssNode);
				pfils[j] = ssNode;
			}
			node.fils = pfils;
		} else {
			var ssNode = new Node();
			json2node(root.children, ssNode);
			node.fils = ssNode;
		}
	}
	return;
}
function getIconVal(root) {
	if (root.fils != undefined && root.fils != null) {
		if (root.fils.length != undefined && root.fils.length != null
				&& root.fils.length > 0) {
			var i = 0;
			while (i < root.fils.length) {
				if (root.fils[i].isVisible)
					return "-";
				i++;
			}
		} else if (root.fils.isVisible)
			return "-";
	}
	return "+";
}
function getIcon(root) {
	if (!root.isClass)
		return 'icons/package.jpg';
	return 'icons/class.jpg';
}
function view(root, doc) { // root is a Node
	if (root.isVisible) {
		if (root.label == "Package list") {
			doc += 
						'<button  name=\"' 
							+ root.fqn
							+ '\" onClick=\'showChildren(\"' 
							+ root.fqn
							+ '\"); \' > '
							+ root.label
			+ '</button>' ;
		} else {
			doc += '<div id=\"' + root.fqn + '\" style=\"cursor:pointer\;width:30px;overflow:visible;\" onClick=\'showChildren(\"'
				+ root.fqn + '\");\'> '
				+'<table><tr><td nowrap=\"nowrap\">'
				+'<img src=\"' + getIcon(root) + '\" alt=\"\" >'
				+ '&nbsp;'
				+ root.label ;
			if(root.isClass && root.superClass!="java.lang.Object"){
				doc+="&nbsp; extends "+root.superClass;
			}
			doc+='</tr></td></table>'
			    +'</div>';
			if (root.isClass ) {
				if (root.showMetadata) {
					doc+='<dl><dd>';
					if(root.showSelectionArea)
						doc = addMetaDataAndSelectionArea(root, doc);
					else 
						if(root.showUpdate)
							doc= addMetaDataAndUpdateArea(root,doc);
						else
							if(root.showInsert)
								doc= addMetaDataAndInsertArea(root,doc);
							else
								doc = addClassMetadata(root, doc);
					if(root.showObjects){
						doc=jsonObjectList2HtmlTable(jsonObjectsList,root.fqn,doc);
						doc+='<br>';
					}
					doc+='</dd></dl>';
				}
				return doc;
			}
		}
	}
	if (root.fils != undefined && root.fils != null) {
		if (root.fils.length != undefined && root.fils.length != null
				&& root.fils.length > 0) {
			var i = 0;
			if (root.fils[0].isVisible)
				doc += '<dl>';
			else
				return doc;
			while (i < root.fils.length) {
				doc += '<dd>';
				doc = view(root.fils[i], doc);
				doc += '</dd>';
				i++;
			}
			doc += '</dl>';
		} else {
			if (root.fils.isVisible)
				doc += '<dl>';
			else
				return doc;
			doc += '<dd>';
			doc = view(root.fils, doc);
			doc += '</dd>';
			doc += '</dl>';
		}
	}
	return doc;
}
function setChildrensVisibility(root, val) {
//	alert("setting children of "+root.label+"to "+val);
	if (root.isClass) {
		root.showMetadata = val;
		if(!val) {
			root.showSelectionArea=false;
			root.showObjects=false;
		}
		return;
	}
	if (root.fils != undefined && root.fils != null) {
		if (root.fils.length != undefined && root.fils.length != null
				&& root.fils.length > 0) {
			var i=0;
			for(i=0;i<root.fils.length;i++) {
				root.fils[i].isVisible = val;
//				alert("child "+i+"/"+root.fils.length+" : "+root.fils[i].label+" .isVisible sat to "+root.fils[i].isVisible);
				if (val==false)
					setChildrensVisibility(root.fils[i], false);
			}
		} else {
			
			root.fils.isVisible = val;
//			alert(root.fils.label+" .isVisible sat to "+root.fils.isVisible);
			if (val==false)
				setChildrensVisibility(root.fils, false);
		}
	}
	return null;
}
function getSymbols(node) {
	if (node.isPublic == "true")
		return '+ ';
	if (node.isPrivate == "true")
		return '- ';
	if (node.isProtected == "true")
		return '# ';
}
function insertOkIcon(boolState) {
	if (boolState == "true")
		return '<img src=\"icons/ok.jpg\" alt=\"\" />';
	return '';
}
function addMetaDataAndSelectionArea(node,doc){
	if (node.fields != undefined && node.fields != null) {
		doc += '<FORM name=\"select'+node.fqn+'\">'
			+'<table border=\"0\" frame=\"void\" rules=\"none\" >'
			+'<tr><th></th></tr><tr><td align=\"right\">'
			+'<br><table border=\"1\" cellpadding=\"3\"  frame=\"box\" rules=\"rows\" >'
				+'<tr bgcolor="LightSteelBlue">'
					+'<th align=\"left\" valign=\"middle\">Fields</th>'
					+'<th align=\"center\" valign=\"middle\">Type</th>'
					+'<th align=\"center\" valign=\"middle\">Private</th>'
					+'<th align=\"center\" valign=\"middle\">Protected</th>'
					+'<th align=\"center\" valign=\"middle\">Public</th>'
					+'<th align=\"center\" valign=\"middle\">Static</th>'
					+'<th align=\"center\" valign=\"middle\">Final</th>'
					+'<th align=\"center\" valign=\"middle\">Inherited</th>'
				//	+'<th><input type=\"button\"  value=\"<<\" onClick=\'addDelSelectionArea(\"'+node.fqn+'\");\'></th>'
					+'<th align=\"center\" valign=\"middle\"></th>'
					+'<th align=\"center\" valign=\"middle\">value</th>'
					+'<th align=\"center\" valign=\"middle\">order by</th>'
				+'</tr>';
		if (node.fields.length != undefined && node.fields.length != null
				&& node.fields.length > 0) {
			for (i = 0; i < node.fields.length; i++) {
				// doc+='<dd>'
				doc += '<tr bgcolor="WhiteSmoke">'
				// +getSymbols(node.fields[i])
							+ '<td align=\"left\" valign=\"middle">';
							if(node.fields[i].isPk=="true")
								doc+='<u>' +node.fields[i].name +'</u>';
							else
								doc+=node.fields[i].name;
							
						doc+= '</td>' 
							+ '<td align=\"center\" valign=\"middle\">' + node.fields[i].type + '</td>' 
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isPrivate) + '</td>'
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isProtected)+ '</td>' 
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isPublic) + '</td>'
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isStatic)+ '</td>' 
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isFinal) + '</td>'
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isInherited) + '</td>'
							+ '<td align=\"center\" valign=\"middle\">'
								+ '<select id=\"'+node.fields[i].name+'cmp\">'
									+ '<option>==</option>'
									+ '<option>></option>'
									+ '<option><</option>'
								+ '</select>'
							+ '</td>'
							+ '<td align=\"center\" valign=\"middle\">'
							+ '<input type=\"text\" name=\"'+node.fields[i].name+'\">'
							+ '</td>'
							+'<td align=\"center\" valign=\"middle\">'
							+'<input type=\"radio\" name=\"orderBy\" value=\"'+node.fields[i].name+'\" />'
							+'</td>'
						+ '</tr>';
			}
			doc += //'<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td align=\"center\" valign=\"middle\">'
				 
				//
				//+'</td></tr>'
				'</table>'//alert(doc);
				+'</td></tr>'
				+'<tr align=\"right\"><td align="\right\">show <input type=\"text\" name=\"limit\" value=\"'+limit+'\" maxlength=\"3\" size=\"2\"> objects per page&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>'
				+'<tr align=\"right\"><td >'
				+'<input type=\"button\" value=\"show\" onClick=\'resetGetParams(\"'+node.fqn+'\");\'>'
				+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
				+'<input type=\"button\"  value=\"cancel\" onClick=\'addDelSelectionArea(\"'+node.fqn+'\");\'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
		//		+'<input type=\"button\" value=\"insert\" onClick=\'_insert(\"'+node.fqn+'\");\'>'
				+'&nbsp;&nbsp;&nbsp;'
				+'</td></tr></table>'
				+'</FORM>';
			//alert("cc 1");
		}
	}
	return doc;
}
function addMetaDataAndUpdateArea(node,doc){
	if (node.fields != undefined && node.fields != null) {
		doc += '<FORM name=\"select'+node.fqn+'\">'
			+'<table border=\"0\" frame=\"void\" rules=\"none\" >'
			+'<tr><th></th></tr><tr><td align=\"right\">'
			+'<br><table border=\"1\" cellpadding=\"3\"  frame=\"box\" rules=\"rows\" >'
				+'<tr bgcolor="LightSteelBlue">'
					+'<th align=\"left\" valign=\"middle\">Fields</th>'
					+'<th align=\"center\" valign=\"middle\">Type</th>'
					+'<th align=\"center\" valign=\"middle\">Private</th>'
					+'<th align=\"center\" valign=\"middle\">Protected</th>'
					+'<th align=\"center\" valign=\"middle\">Public</th>'
					+'<th align=\"center\" valign=\"middle\">Static</th>'
					+'<th align=\"center\" valign=\"middle\">Final</th>'
					+'<th align=\"center\" valign=\"middle\">Inherited</th>'
					+'<th align=\"center\" valign=\"middle\">value</th>'
				+'</tr>';
		if (node.fields.length != undefined && node.fields.length != null
				&& node.fields.length > 0) {
			for (i = 0; i < node.fields.length; i++) {
				doc += '<tr bgcolor="WhiteSmoke">'
							+ '<td align=\"left\" valign=\"middle">';
							if(node.fields[i].isPk=="true")
								doc+='<u>' +node.fields[i].name +'</u>';
							else
								doc+=node.fields[i].name;
						doc+= '</td>' 
							+ '<td align=\"center\" valign=\"middle\">' + node.fields[i].type + '</td>' 
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isPrivate) + '</td>'
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isProtected)+ '</td>' 
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isPublic) + '</td>'
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isStatic)+ '</td>' 
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isFinal) + '</td>'
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isInherited) + '</td>'
							+ '<td align=\"center\" valign=\"middle\">'
							+ '<input type=\"text\" name=\"'+node.fields[i].name+'\">'
							+ '</td>'
						+ '</tr>';
			}
			doc += 
				'</table>'
				+'</td></tr>'
				+'<tr align=\"right\"><td >'
				+'<input type=\"button\" value=\"Save\" onClick=\'_update(\"'+node.fqn+'\");\'>'
				+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
				+'<input type=\"button\" value=\"Cancel\" onClick=\'showUpdatePreviousPage(\"'+node.fqn+'\");\'>'
				+'</td></tr></table>'
				+'</FORM>';
		}
		
		
	}
	return doc;
}
		function test(kk){
			var n=new Node();
			n=kk;
			alert(kk.length);
			alert(kk.fqn);
			alert(n.label);
		}
function addMetaDataAndInsertArea(node,doc){
	if (node.fields != undefined && node.fields != null) {
		doc += '<FORM name=\"select'+node.fqn+'\">'
			+'<table border=\"0\" frame=\"void\" rules=\"none\" >'
			+'<tr><th></th></tr><tr><td align=\"right\">'
			+'<br><table border=\"1\" cellpadding=\"3\"  frame=\"box\" rules=\"rows\" >'
				+'<tr bgcolor="LightSteelBlue">'
					+'<th align=\"left\" valign=\"middle\">Fields</th>'
					+'<th align=\"center\" valign=\"middle\">Type</th>'
					+'<th align=\"center\" valign=\"middle\">Private</th>'
					+'<th align=\"center\" valign=\"middle\">Protected</th>'
					+'<th align=\"center\" valign=\"middle\">Public</th>'
					+'<th align=\"center\" valign=\"middle\">Static</th>'
					+'<th align=\"center\" valign=\"middle\">Final</th>'
					+'<th align=\"center\" valign=\"middle\">Inherited</th>'
					+'<th align=\"center\" valign=\"middle\">value</th>'
				+'</tr>';
		if (node.fields.length != undefined && node.fields.length != null
				&& node.fields.length > 0) {
			for (i = 0; i < node.fields.length; i++) {
				doc += '<tr bgcolor="WhiteSmoke">'
							+ '<td align=\"left\" valign=\"middle">';
							if(node.fields[i].isPk=="true")
								doc+='<u>' +node.fields[i].name +'</u>';
							else
								doc+=node.fields[i].name;
						doc+= '</td>' 
							+ '<td align=\"center\" valign=\"middle\">' + node.fields[i].type + '</td>' 
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isPrivate) + '</td>'
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isProtected)+ '</td>' 
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isPublic) + '</td>'
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isStatic)+ '</td>' 
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isFinal) + '</td>'
							+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isInherited) + '</td>'
							+ '<td align=\"center\" valign=\"middle\">'
							+ '<input type=\"text\" name=\"'+node.fields[i].name+'\">'
							+ '</td>'
						+ '</tr>';
			}
			doc += 
				'</table>'
				+'</td></tr>'
				+'<tr align=\"right\"><td >'
				+'<input type=\"button\" value=\"Create\" onClick=\'_insert(\"'+node.fqn+'\");\'>'
				+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
				+'<input type=\"button\" value=\"Cancel\" onClick=\'showInsertPreviousPage(\"'+node.fqn+'\");\'>&nbsp;'
				+'</td></tr></table>'
				+'</FORM>';
		}
	}
	return doc;
}
function showInsertPreviousPage(fqn){
	doc="";
	var node = getNodeByName(listRoot, fqn);
	node.showInsert=false;
	node.showMetadata=true;
	doc= view(listRoot,doc);
	showNewPage(doc);
}
function showUpdatePreviousPage(fqn){
	doc="";
	var node = getNodeByName(listRoot, fqn);
	node.showUpdate=false;
//	node.showMetadata=true;
	node.showSelectionArea=true;
	node.showObjects=true;
	doc= view(listRoot,doc);
	showNewPage(doc);
}
//var currentClass="";
function resetGetParams(fqn){
	//if(fqn!=currentClass){
//	currentClass=fqn;
	filter="";
	orderBy="";
	page=1;
	sens=0;
	showObjects(fqn);
}
function addDelSelectionArea(fqn){
	var node = getNodeByName(listRoot, fqn);
     node.showCreate=false;
	 node.showSelectionArea=!node.showSelectionArea;
	 doc=view(listRoot,'');
	 showNewPage(doc);
//	 document.getElementById("list").innerHTML= doc;
}
function showInsertView(fqn){
	var node = getNodeByName(listRoot, fqn);
	node.showObjects=false;
	node.showUpdate=false;
	node.showSelectionArea=false;
	node.showInsert=true;
	node.showMetadata=true;
	doc=view(listRoot,'');
	showNewPage(doc);

}
function addClassMetadata(node, doc) {
	if (node.fields != undefined && node.fields != null) {
		doc +='<br><table border=\"0\" cellpadding=\"3\"  frame=\"void\" rules=\"rows\" >'
				+'<tr bgcolor="LightSteelBlue">'
					+'<th align=\"left\" valign=\"middle\">Fields</th>'
					+'<th align=\"center\" valign=\"middle\">Type</th>'
					+'<th align=\"center\" valign=\"middle\">Private</th>'
					+'<th align=\"center\" valign=\"middle\">Protected</th>'
					+'<th align=\"center\" valign=\"middle\">Public</th>'
					+'<th align=\"center\" valign=\"middle\">Static</th>'
					+'<th align=\"center\" valign=\"middle\">Final</th>'
					+'<th align=\"center\" valign=\"middle\">Inherited</th>'
				//	+'<th><input type=\"button\"  value=\">>\" onClick=\'addDelSelectionArea(\"'+node.fqn+'\");\'></th>'
				+'</tr>';
		if (node.fields.length != undefined && node.fields.length != null
				&& node.fields.length > 0) {
			for (i = 0; i < node.fields.length; i++) {
				doc += '<tr bgcolor="WhiteSmoke">'
						+'<td align=\"left\" valign=\"middle">';
						if(node.fields[i].isPk=="true")
							doc+='<u>' +node.fields[i].name +'</u>';
						else
							doc+=node.fields[i].name;
					doc+= '</td>' 
						+ '<td align=\"center\" valign=\"middle\">' + node.fields[i].type + '</td>' 
						+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isPrivate) + '</td>'
						+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isProtected)+ '</td>' 
						+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isPublic) + '</td>'
						+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isStatic)+ '</td>' 
						+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isFinal) + '</td>'
						+ '<td align=\"center\" valign=\"middle\">' + insertOkIcon(node.fields[i].isInherited) + '</td>'
					//	+'<td></td>'
				+ '</tr>';
			}
				doc+='<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td>'
					+'<td>' 
					+'<input type=\"button\"  value=\"show objects\" onClick=\'addDelSelectionArea(\"'+node.fqn+'\");\'>'
					+'<br><input type=\"button\"  value=\"create object\" onClick=\'showInsertView(\"'+node.fqn+'\");\'>'
					+'</td>'
					+'</tr>'
					+'</table><br>';
		}
	}
	return doc;
}
var filter="";
var limit=10;
var sens=0;
var orderBy="";
var resultMin=0;
var resultMax=0;
function createGetUrl(fqn){
//	alert("hideShowObjects "+fqn);
	
	var node = getNodeByName(listRoot, fqn);
	//	alert("creating getUrl for"+fqn);
var tmp=document.forms["select"+fqn].elements["limit"];
if(tmp!=undefined && tmp!=null)
	limit=document.forms["select"+fqn].elements["limit"].value;
var index=document.forms["select"+fqn].elements["orderBy"].selectedIndex;
var i;
if(sens==0){
	if(node.fields.length==1)
		  orderBy=document.forms["select"+fqn].orderBy.value;
	else
	for (i=0;i<node.fields.length;i++){
		  if(document.forms["select"+fqn].orderBy[i].checked ){
			  orderBy=document.forms["select"+fqn].orderBy[i].value;
		  }
		}
}
resultMin=(page-1)*limit;
resultMax=resultMin*1+limit*1;
//alert("page="+page+"\nlimit="+limit+"resultMin="+resultMin+"\nresultMax="+resultMax);
var getUrl="";
var i=0;
var eltValue;
if(sens==0){
	for(i=0;i<node.fields.length;i++){
		eltValue=document.forms["select"+fqn].elements[node.fields[i].name].value;
		var crtieria="";
		if(eltValue!=undefined && eltValue!=null && eltValue!=""){
			var index=document.forms["select"+fqn].elements[node.fields[i].name+'cmp'].selectedIndex;
			criteria="("
				+node.fields[i].name
				+document.forms["select"+fqn].elements[node.fields[i].name+'cmp'].options[index].value;
			if(node.fields[i].type=="java.lang.String") criteria+="\""+eltValue+"\"";
			else criteria+=eltValue;
				criteria+=")";
			//alert("criterion "+criteria);
			if(filter=="") filter+=criteria;
			else filter+=" && "+criteria;
		}
	}
}
//	filter='\"'+filter+'\"';
	//alert("get filter:" + filter);
	//if(filter=="") getUrl="dn/"+fqn; 
	//else getUrl="dn/"+fqn+"?"+escape(filter);
	getUrl=""
		+"fqn="+fqn
		+"&filter="+escape(filter)
		+"&orderBy="+orderBy
		+"&limit="+"900"
		+"&sens="+sens
	    +"&resultMin="+resultMin
	    +"&resultMax="+resultMax;
	getUrl="ObjectListing?"+getUrl;
//	alert("get url:\n" + getUrl);
	return getUrl;
 //   alert(filter+"\n"+escape(filter));
	//alert(document.forms["select"].elements[node.fields[0].name+'cmp'].value);
}
function createPutUrl(fqn){
	var putUrl="";
	putUrl=fqn+"/"+pkVal2update;
//	alert(putUrl+"\n\n"+escape(putUrl));
	
	return putUrl;
}
function switchColor(color){
	if (color=="WhiteSmoke")
		return "#DCDCDC";
		return "WhiteSmoke";
}
var size=0;
var page=1;
function jsonObjectList2HtmlTable(objects,fqn,res){

	color="WhiteSmoke";
	var node = getNodeByName(listRoot, fqn);
//	var limit=document.forms["select"+fqn].elements["limit"].value;
	if(sens==0)	{
		size=objects[objects.length-1].size;
		alert(" sens =0 ,size:" +size);
		if (size==0) return res+="No result found";
		objects.length=size;
		sens="+";
		}
	//alert("size,limit,size/limit: "+size+","+limit+","+size/limit);
	if(page==1 || limit >=size ) res+='<input type=\"button\" disabled value=\"<\">';
	else
	res+='    <input type=\"button\" value=\"<\" onClick=\"page=page/1-1;sens=\'-\';showObjects(\''+fqn+'\');\">';
	res+='&nbsp;&nbsp;&nbsp;page<select onChange=\"page=this.value;sens=\'+\';showObjects(\''+fqn+'\');\">';
	var i=1;
	var npages;
	var npages=size/limit;
	npages=npages-(npages%1);
	if((size%limit)!=0) npages++;
	
	for(var i=1;i<=npages;i++){
		if(i==page) res+= '<option selected value=\"'+i+'\">'+i+'</option>';
		else res+= '<option value=\"'+i+'\">'+i+'</option>';
	}
	if(limit >=size ) res+= '<option selected value=\"1\">1</option>'
						 +'</select> of 1';
	else
	res+='</select> of '+npages;
	if(page==npages || limit >=size ) res+='&nbsp;&nbsp;&nbsp;<input type=\"button\" disabled value=\">\" onClick=\"sens=\'+\';showObjects(fqn)\"><br>';
	else
		res+='&nbsp;&nbsp;&nbsp;<input type=\"button\" value=\">\" onClick=\"page=page/1+1;sens=\'+\';showObjects(\''+fqn+'\');\"><br>';
    res+='<table border=\"1\" cellpadding=\"5\" cellspacing=\"1\" frame=\"border\" rules=\"rows\" >'
	+'<tr bgcolor=\"LightSteelBlue\">'
	+'<th></th><th>&nbsp;</th>';
	var i=0;
	var pkName;
	var pkVal;
	//alert("start");
	for(i=0;i<node.fields.length;i++){
		res+='<th align=\"center\" valign=\"middle\">'+node.fields[i].name+'</th>';
		if(node.fields[i].isPk=="true") pkName=node.fields[i].name;
	}
	//alert("pk is"+pkName);
	//alert("oui");
	if(pkName==undefined || pkName==null) alert("Primary Key value cannot be determined for this object!");
	res+='</tr>';
	for(i=0;i<objects.length && i<limit;i++){
		pkVal=eval("objects[i]."+pkName);
		res+='<tr bgcolor=\"'+color+'\">';
		res+='<td>'
				+'<button type=\"button\" onClick=\'createUpdateView(\"'+node.fqn+'\",\"'+pkName+'\",\"'+pkVal+'\");\'><img src=\"icons/edit.jpg\"/></button>'
			+'</td>'
			+'<td>'
				+'<button type=\"button\" onClick=\'_delete(\"'+node.fqn+'\",\"'+pkVal+'\");\'><img src=\"icons/delete.jpg\"/></button>'
			+'</td>';
		for(j=0;j<node.fields.length;j++){
			var attribut=objects[i];
			res+='<td>'+eval("attribut."+node.fields[j].name)+'</td>';
		}
		res+='</tr>';
		color=switchColor(color);
	}
	res+='</table>';
	//alert(res);
	return res;
}
function _insert(fqn){
	var newObject=createInsertObject(fqn);
	var node=getNodeByName(listRoot, fqn);
	//newObject=escape(newObject);
	$.ajax({
		url : 'dn/'+fqn,
		type: 'POST',
		dataType : 'json',
		data: newObject,
		timeout : 3000,
		success : function(feed) {
			//jsonObjectsList=feed;
			//var x = feed;
//			alert(feed);
			//document.write(feed);
			//alert("showObjects success");
			node.showObjects=false;
			doc="";
			doc= view(listRoot, doc);	
			showNewPage(doc);
//			document.getElementById("list").innerHTML= doc;
		}
	});
//	alert("fin ajax");


}
function createInsertObject(fqn){
	var node = getNodeByName(listRoot, fqn);
	var jsonString="{";
	var i=0;
	var attributeValue;
	var attributeName;
	for(i=0;i<node.fields.length;i++){
		if(jsonString!="{") jsonString+=',';
		attributeName=node.fields[i].name;
		attributeValue=document.forms["select"+fqn].elements[attributeName].value;
		if(attributeValue!=undefined && attributeValue!=null ){
			jsonString+='\"'+attributeName+'\"'+':'+'\"'+attributeValue+'\"';	
		}
	}
	jsonString+="}";
	//alert(jsonString);
	return jsonString;	
}
function _delete(fqn,pkVal){
	var deleteUrl='dn/'+fqn+'/'+escape(pkVal);
//	alert("delete url was:"+deleteUrl);
	$.ajax({
		url : deleteUrl,
		type: 'DELETE',
		dataType : 'text',
	//	data: newObject,
		timeout : 3000,
		success : function(feed) {
			alert("deleted!");
			//jsonObjectsList=feed;
			//var x = feed;
//			alert(feed);
			//document.write(feed);
			//alert("showObjects success");
		//	node.showObjects=false;
		//	doc="";
		//	doc= view(listRoot, doc);	
		//	showNewPage(doc);
//			document.getElementById("list").innerHTML= doc;
		}
	});	
//	alert("delete url was:"+deleteUrl);
}
var pkVal2update="";

function createUpdateView(fqn,pkName,pkVal){
//	alert("fqn,pkName,pKval "+fqn+"\n"+pkName+"\n"+pkVal);
	pkVal2update=pkVal;
	var objectToUpdate;
	for(i=0;i<jsonObjectsList.length && i<limit;i++){
		var eltPkVal=eval("jsonObjectsList[i]."+pkName);
		if(eltPkVal==pkVal) 
			{objectToUpdate=jsonObjectsList[i]; break;}
	}
	var node = getNodeByName(listRoot, fqn);
	node.showObjects=false;
	node.showSelectionArea=false;
	node.showInsert=true;
	node.showUpdate=true;
	doc="";
	doc=view(listRoot,doc);
	showNewPage(doc);
			for(j=0;j<node.fields.length;j++){
				var attribut=node.fields[j];
				document.forms["select"+fqn].elements[attribut.name].value=objectToUpdate[attribut.name];
			}
}
function _update(fqn){
//	alert("execution de update");
	var newObject=createInsertObject(fqn);
	var putUrl=createPutUrl(fqn);
	
	var node=getNodeByName(listRoot, fqn);
	//newObject=escape(newObject);
	$.ajax({
		url : 'dn/'+putUrl,
		type: 'PUT',
		dataType : 'json',
		data: newObject,
		timeout : 3000,
		success : function(feed) {
			alert("update success");
			//jsonObjectsList=feed;
			//var x = feed;
//			alert(feed);
			//document.write(feed);
			//alert("showObjects success");
			node.showObjects=false;
			doc="";
			doc= view(listRoot, doc);	
			showNewPage(doc);
//			document.getElementById("list").innerHTML= doc;
		}
	});
/*
	var req = null; 

	document.ajax.dyn.value="Started...";
	if(window.XMLHttpRequest)
		req = new XMLHttpRequest(); 
	else if (window.ActiveXObject)
		req  = new ActiveXObject(Microsoft.XMLHTTP); 

	req.onreadystatechange = function()
	{ 
		document.ajax.dyn.value="Wait server...";
		if(req.readyState == 4)
		{
			if(req.status == 200)
			{
				document.ajax.dyn.value="Received:" + req.responseText;	
			}	
			else	
			{
				document.ajax.dyn.value="Error: returned status code " + req.status + " " + req.statusText;
			}	
		} 
	}; 
	req.open("PUT", putUrl, true); 
	req.setRequestHeader("Content-Type", "application/json"); 
	req.send(newObject); 
*/

























}
//$.ajaxSetup({cache: false}); 

function showObjects(fqn){
//	alert("showObjects start");
	var node = getNodeByName(listRoot, fqn);
	//node.showObjects=!node.showObjects;
	node.showObjects=true;
	var getUrl=createGetUrl(fqn);
//	alert(getUrl);
//	alert("url "+getUrl);
	//getUrl=escape(getUrl);
//	alert("final url "+ unescape(getUrl));
	$.ajax({
		url : getUrl,
	//	cache: false,
		type : 'GET',
		dataType : 'json',
		
	//	 data: new Date(),
		timeout : 3000,
		success : function(feed) {
		//	alert("seccess");
			jsonObjectsList=feed;
		//	alert(feed);
			//var x = feed;
			//alert(feed);
			//document.write(feed);
			//alert("showObjects success");
			doc="";
			doc= view(listRoot, doc);
		//	if(node.showObjects) 
			
			//document.write(doc);
			// document.writeln("start");
//			
			showNewPage(doc);
//			document.getElementById("list").innerHTML= doc;
			node.showObjects=false;
		}
	});
//	alert("fin ajax");
}
function isOpened(node){
	if (node.fils != undefined && node.fils != null) {
		if (node.fils.length != undefined && node.fils.length != null && node.fils.length > 0) {
			for (i = 0; i < node.fils.length; i++) {
				if(node.fils[i].isVisible) return true;
				else 
				//	{alert(node.label+" is not opened because "+node.fields[i].label+" is invisible");
					return false;
				//	}
			}
		} else {
			if(node.fils.isVisible) return true;
			else 
			//{alert(node.label+" is not opened because "+node.fields.label+" is invisible");
			return false;
			//}
		}
	}
//	alert(node.label+" is not opened because it dosen't have any child");
	return false;
}
function showChildren(nodeFqn) {
	var node = getNodeByName(listRoot, nodeFqn);
	if (node == undefined || node == null) {
		alert("erreur getNodeByName");
		return;
	}
	if (node.isClass) {
		if (node.showMetadata) {
			node.showMetadata = false;
			node.showSelectionArea=false;
			node.showObjects=false;
			node.showUpdate=false;
			node.showInsert=false;
		} else {
			node.showMetadata = true;
			node.showSelectionArea=false;
			node.showObjects=false;
			node.showUpdate=false;
			node.showCreate=false;
		}
		doc = "";
		doc = view(listRoot, doc);
		showNewPage(doc);
		
		//document.getElementById("list").innerHTML = doc;

		return;
	}
//	alert(document.getElementByName(nodeFqn).value);
	//var val = $('input:hidden[name=' + nodeFqn + ']').val();
	//if (val != undefined && val != null) {
	//	if (val == "+") {// alert(valeur);
	//	alert(node.label+" was opened ?"+isOpened(node));
		if(isOpened(node)==false){
			setChildrensVisibility(node, true);
		}
		else{
	//	} else {
			setChildrensVisibility(node, false);
		}
	//	alert(node.label+" is now opened ?"+isOpened(node));
		doc = "";
		
		doc = view(listRoot, doc);
		//alert(doc);
		showNewPage(doc);
		//document.getElementById("list").innerHTML = doc;
		//doc="cc";
	//	var longueurCible = document.getElementById("list").firstChild.rl;//.length;
	//	var oldChild=document.getElementsByName("list").item(0);
	//	var newChild= document.createTextNode("cc");
//		newChild.data=doc;
	//	document.removeChild(oldChild);
	//	alert(oldChild);
	
	//	var newChild= HTMLParagraphElement();
	//	alert(oldChild);
	//	alert(newChild);
	//	document.removeChild(oldChild);
		//newChild.data="cc";
	//	document.body.appendChild(newChild);
//		document.replaceChild(newChild, oldChild);
	//	alert(newChild);
	//	oldChild.replaceChild(newChild, oldChild);
		//document.getElementsByName("").item(1).replaceChild(newChild, oldChild)
		//document.replaceChild(newChild, oldChild);
		//alert(longueurCible);
	//	document.getElementById("list").firstChild.replaceData(0, longueurCible, doc);
	//} else
	//	alert("valeur indéfinie");
	return;
}
function showNewPage(doc){
document.body.innerHTML=doc;
		//'<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">'
	//	+
		/*	'<html>'
			+'<head>'
				+'<meta http-equiv=\"Content-Type\" content=\"text/html; charset=ISO-8859-1\">'
				+'<title>JDO Administrator</title>'
			+'</head>'
			+'<body>'
				+'<H2 align=\"center\">JDO Administator</H2>'
				+'<br>'
				+'<p id=\"list\" name=\"list\">' 
					+doc
				+'</p>'
			+'<script type="text/javascript" src="jquery.min.js"></script>'
			+'<script type="text/javascript" src="treeHandler.js"></script>'
			+'<!--<script type="text/javascript" src="json.as"></script>-->'
		+'</body>'
		+'</html>');
		*/
	
}
start();