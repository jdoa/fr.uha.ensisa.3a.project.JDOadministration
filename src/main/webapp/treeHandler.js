function Node(label,fils) {
	this.label=label;
	this.fils=fils;
	this.isVisible=false;
	this.fqn="Package list";
}
function getNodeByName(root,nodeName){
	if(nodeName==root.fqn) return root;
	if(root.fils!=undefined && root.fils!=null){
			if(root.fils.length!=undefined && root.fils.length!=null && root.fils.length >0){
				var i=0;
				while(i<root.fils.length){
					var res=getNodeByName(root.fils[i],nodeName);
					if(res!=undefined && res!=null) return res;
					i++;
				}
			}
			else{
				return getNodeByName(root.fils,nodeName);
			}

		}		
		return null;
}
function generateFqn(root) { //root is a Node
//	document.write(root.label+"<br>");
	if(root.fils!=undefined && root.fils!=null){
	//	document.write(root.label+" has children<br>");
		if(root.fils.length!=undefined && root.fils.length!=null && root.fils.length >0){
		//	document.write(root.label+" has "+root.fils.length +" children<br>");
			var i=0;
			while(i<root.fils.length){
			//	document.write(root.fils.label+"is the "+i+" child of "+root.label+"<br>");
				if(root.fqn!="Package list")
					root.fils[i].fqn=root.fqn+"."+root.fils[i].label;
				else
					root.fils[i].fqn=root.fils[i].label;
				generateFqn(root.fils[i]);
				i++;
			}
		}
		else{
		//	document.write(root.label+" has only one child wich is:"+ root.fils.label+"<br>");
			if(root.fqn!="Package list")
				root.fils.fqn=root.fqn+"."+root.fils.label;
			else
				root.fils.fqn=root.fils.label;
			generateFqn(root.fils);
				//		doc=view(root.fils,doc);
				//		document.write(root.label+" a un seul fils : "+ root.fils.label);
		}

	}		
	return ;
}

function json2node(root,node){ // root is a Json Object , node is a Node
//	document.writeln("<br> => "+root.label+"<br>");
	if(root.label!=undefined){
	//	document.writeln("<br>"+root.label+"<br>");
	//	if(node.label!=undefined && node.label!=null) node.label=node.label+"."+root.label;
	//	else
			node.label=root.label;
		//document.write(root.label+"<br>");
//		if (root.isClass=="true") { return;
//		document.write("is a class");
//			}
		//afficher(root.children);
	}
		//cas d_un arbre donc affichage des noeuds
	if( root.children!=undefined && root.children!=null){
	//	document.write("<br> info => "+root.label);
	//	document.write("<br>element avec fils :"+ root.label +"<br>");
		
		if(root.children.length!=undefined && root.children.length!=null && root.children.length>0) {
			//document.write("<br>element avec "+root.children.length +" fils :"+ root.label+"<br>" );
			var pfils= new Array(root.children.length);
			var j=0;
			// c une suite d_elements , donc affichage un par un
			for(j=0;j<root.children.length;j++){
	//			document.write(root.label+".children["+j+"]:"+root.children[j].label+"<br>");
				var ssNode= new Node();
		//		ssNode.label= root.label;
				json2node(root.children[j],ssNode);
				pfils[j]=ssNode;
			}
			node.fils=pfils;
		}else{
			var ssNode= new Node();
	//		ssNode.label=root.label;
			json2node(root.children,ssNode);
			node.fils=ssNode;
		}
	}	
	return ;
}
var tab=1;
function getIconVal(root){
if(root.fils!=undefined && root.fils!=null){
	if(root.fils.length!=undefined && root.fils.length!=null && root.fils.length >0){
//		document.write(root.label+" a "+ root.fils.length +"fils<br>");
		var i=0;
		while(i<root.fils.length){
			if(root.fils[i].isVisible) return "-";
			i++;
		}
	}else
		if(root.fils.isVisible) return "-";
}		
return "+";


}
function view(root,doc) { //root is a Node
//	document.writeln("<br>");
//	document.writeln(root.label);
	//with (this) {
	//if (!root.isVisible) return doc;
	
	if(root.isVisible){
			//document.write(root.fqn+"<br>");
		for(i=0;i<tab;i++,doc+="&nbsp;");
		doc+='<a href="javascript:;" onClick=\'showChildren(\"'+root.fqn+'\");\'>';
	 	doc+="<input type=\"button\" " +"name=\""+root.fqn+"\" " +"value=\""+getIconVal(root)+"\" style=\"font-size:3mm; padding: 0%; \" /> "+root.fqn+"&nbsp;";
	 	doc+="</a>";
		doc+="<br>";
	}
	if(root.fils!=undefined && root.fils!=null){
//	 document.write(root.label+" a des fils que voilà :<br>");
		tab=tab+3;
		if(root.fils.length!=undefined && root.fils.length!=null && root.fils.length >0){
	//		document.write(root.label+" a "+ root.fils.length +"fils<br>");
			var i=0;
			while(i<root.fils.length){
	//			document.writeln(" traitement de "+root.fils[0].label);
	//			document.write(root.fils[i].label+" est le fils "+i+"/" +root.fils.length +"de"+root.label);
				doc=view(root.fils[i],doc);
				i++;
			}
		}else
			doc=view(root.fils,doc);
	//		document.write(root.label+" a un seul fils : "+ root.fils.label);
		    tab=tab-3;
	}		
	return doc;
}

tree= Array();
tree[0]=Array();
function setChildrensVisibility(root,val){
	if(root.fils!=undefined && root.fils!=null){
			if(root.fils.length!=undefined && root.fils.length!=null && root.fils.length >0){
				var i=0;
				while(i<root.fils.length){
					root.fils[i].isVisible=val;
					if(!val) setChildrensVisibility(root.fils[i],val);
					i++;
				}
			}
			else{
				root.fils.isVisible=val;
				if(!val) setChildrensVisibility(root.fils,val);
			}
		}		
		return null;
}
function showChildren(nodeFqn){
	//alert("recherche de "+nodeFqn);
	var node=getNodeByName(listRoot,nodeFqn);
	if(node==undefined || node == null) { alert("erreur getNodeByName");return;}
	//$(document).ready(function(){
	    
	//});
	
var val=	$('input:button[name='+nodeFqn+']').val();
//	var valeur=$("input[name="+nodeFqn+"]")[0].value;
//	$(":input,[name='"+nodeFqn+"'],:first").Val("-");
	
	if (val!=undefined && val!=null){
		if(val=="+"){//alert(valeur);
		//	$('input:button[name='+nodeFqn+']').val("-");
			setChildrensVisibility(node,true);
		}
		else{//alert(valeur);
		//	$('input:button[name='+nodeFqn+']').val("+");
			setChildrensVisibility(node,false);
		}
		var doc="";
		doc=view(listRoot,doc);
		document.getElementById("list").innerHTML = doc;
/*	
		if(val=="+"){
			$('input:button[name='+nodeFqn+']').val("-");
		}
		else{
			$('input:button[name='+nodeFqn+']').val("+");
		}
		*/
	}
	else alert("valeur indéfinie");
	return;
}
function initAffichgeArbre(root){
	if(root.length>0) {
		tree[treeI]=Array();
		// c une suite d_elements , donc affichage un par un
		for(j=0;j<root.length;j++){
			initAffichgeArbre(root[j]);treeI++;tree[treeI]=Array();
		}
			return;
		
	}
	if(root.label!=undefined){
		tree[treeI][treeJ]=Array();
		tree[treeI][treeJ][0]=root.label;
		tree[treeI][treeJ][1]=0;
		document.write(treeI+"."+treeJ+root.label+"<br>");
		if (root.isClass=="true") { return;
//		document.write("is a class");
			}
		//afficher(root.children);
	}
		//cas d_un arbre donc affichage des noeuds
	if( root.children!=undefined && root.children!=null){
		treeJ++;  
		initAffichgeArbre(root.children);
	}
	return;	
}
function afficher(root){
//	document.write("affiche");
	
	if(root.length>0) {
		// c une suite d_elements , donc affichage un par un
		for(j=0;j<root.length;j++)
			afficher(root[j]);
			return;
	}treeI++;
	if(root.label!=undefined && tree[treeI][treeJ][1]==1){
		//treeI++;
		for(i=0;i<treeJ;i++){
			document.write("&nbsp;");
		}
		//document.write(root.label);
//<button name="cliquemoi" type="button"
//  value="" onClick="self.content.document.body.setAttributeNS("cliquemoi", "value", -)" style="font-size:3mm; padding: 0%;">
 		document.write("<input type=\"button\" name=\""+treeI+"."+treeJ+"\""+"value=\"\" onclick=\"showChildren("+treeI+","+treeJ+")\" \"style=\"font-size:3mm; padding: 0%; \">+</input> "+treeI+"."+treeJ+"."+root.label+"&nbsp;");

		//document.write(treeI+"."+treeJ+"."+root.label+"&nbsp;");
		if (root.isClass=="true") {
		document.write("is a class");
			}
		//afficher(root.children);
		document.write("<br>");
	}
		//cas d_un arbre donc affichage des noeuds
	if( root.children!=undefined && root.children!=null){
		treeJ++; 
		afficher(root.children);
	}
	return;
}


