package servlets.utils;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.jdo.annotations.PersistenceCapable;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class JsonHelper {
	public static JSONObject tab=null;
	
	public static JSONObject process(HashSet<String> classList) throws SecurityException, ClassNotFoundException, JSONException{
		tab=new JSONObject();
		Iterator<String> it = classList.iterator();
		String fqn=null;
		ArrayList<String> packageTree=new ArrayList<String>();
		TreeNode root= new TreeNode("Package list");
		TreeNode start=root;
		TreeNode child ;//= new TreeNode(name);
		while(it.hasNext()){
			start=root;
			fqn=it.next();
			Boolean isPersistent=Class.forName(fqn).isAnnotationPresent(PersistenceCapable.class);
			if(!isPersistent) continue;
			System.out.println("fqn =>"+ fqn);
			TreeNode metadata=new TreeNode("class.fields.metadata");
			for (Field f : Class.forName(fqn).getDeclaredFields()) {
					if(f.getName().startsWith("jdo")) continue;
					int mod=f.getModifiers();
					TreeNode desc=new TreeNode("field.metadata");
      				desc.addAttribute("name", f.getName());
					desc.addAttribute("type", f.getType().getName());
					desc.addAttribute("isReadable", bool2Str(Modifier.isPublic(mod)));
					desc.addAttribute("isFinal", bool2Str(Modifier.isFinal(mod)));
					desc.addAttribute("isPrivate", bool2Str(Modifier.isPrivate(mod)));
					desc.addAttribute("isProtected", bool2Str(Modifier.isProtected(mod)));
					desc.addAttribute("isStatic", bool2Str(Modifier.isStatic(mod)));
					metadata.addChild(desc);
				};
			int i=0;
			String[] tab=fqn.split("\\.");
		//	System.out.println("cette classe est directement inseree sous route"+ fqn +" taille :"+tab.length);
			if (tab.length==0) {
				System.out.println("cette classe est directement inseree sous route"+ fqn);
				child=new TreeNode(fqn);
				child.addAttribute("isClass", "true");
				root.addChild(child);
			}
			else{
				while(i<tab.length){
					packageTree.add(tab[i++]);
				}
				
				while(packageTree.size()>0){
	   				    child = start.findChild(packageTree.get(0));
	   					if(child==null) {
	   						child=new TreeNode(packageTree.get(0));
	   						if(packageTree.size()==1) child.addChild(metadata);
	   						start.addChild(child);
	   					}
	   					start=child;
	   					packageTree.remove(0);
					 }
			}
		}
		//show(root, 0);
		tree2Json(root, tab);
		show(root, 0);
		System.out.println(tab);
		return tab;
	}
	public static String bool2Str(Boolean b){
		if( b) return "true"; 
		return "false";
	}
    public static void tree2Json(TreeNode arbre,JSONObject tableau) throws JSONException{
    	//Iterator<TreeNode> it = arbre.findChildren();
    	//if (!it.hasNext()) return;
		TreeNode node=arbre;
	//	int i=0;
	//	System.out.println("info: "+arbre.getName()+"{");
 //   	while(it.hasNext()){
//    		i++;
  //  		node=it.next();
    //		System.out.println("\t"+node.getName());
				tableau.put("label", node.getName());
    			if (node.findChildren()!=null && TreeNode.class.cast(node.findChildren().next()).getName().compareTo("class.fields.metadata")==0){
    				tableau.put("isClass", "true");
    				Iterator<TreeNode> iter=TreeNode.class.cast(node.findChildren().next()).findChildren();
    				while(iter.hasNext()){
    					TreeNode fieldMetadata= iter.next();
    					JSONObject att=new JSONObject();
    	    			att.put("name",fieldMetadata.findAttribute("name"));
    	    			//att.put("type",fieldMetadata.findAttribute("type"));
    	    			//att.put("isPublic",fieldMetadata.findAttribute("isPublic"));
    	    			//att.put("isPrivate",fieldMetadata.findAttribute("isPrivate"));
    	    			//att.put("isProtected",fieldMetadata.findAttribute("isProtected"));
    	    			//att.put("isStatic",fieldMetadata.findAttribute("isStatic"));
    	    			//att.put("isFinal",fieldMetadata.findAttribute("isFinal"));
    	    			tableau.accumulate("fields", att);
    				}
    			}
    			else{
 //   				tableau.put("id", node.getName());
    				
    				Iterator<TreeNode> it = arbre.findChildren();
    				while(it.hasNext()){
    					TreeNode child =it.next();
    					JSONObject sselt=new JSONObject();
    					tree2Json(child, sselt);
        				tableau.accumulate("children", sselt);
    				}
    				
   // 				System.out.println(node.getName()+" has as child "+sselt.get("id"));
 //   				tableau.put("children ", sselt);
    				//tableau.accumulate("children",sselt);
    			}
    	//System.out.println("}");
    }
	/*
    public static void tree2Json(TreeNode arbre,JSONObject tableau) throws JSONException{
    	Iterator<TreeNode> it = arbre.findChildren();
    	if (!it.hasNext()) return;
		TreeNode node;
    	while(it.hasNext()){
    		node=it.next();
//    		JSONArray sstab= new JSONArray();
    		JSONObject sselt=new JSONObject();
    		if(node.getName().compareTo("class.fields.metadata")==0){
//    			sstab= new JSONArray();
//    			tree2Json(node, sstab);
//    			tableau.put(sstab);
    			tree2Json(node,sselt);
    		}
    		else if(node.getName().compareTo("field.metadata")==0){
    			tableau.put("name",node.findAttribute("name"));
    			tableau.put("type",node.findAttribute("type"));
    			tableau.put("isPublic",node.findAttribute("isPublic"));
    			tableau.put("isPrivate",node.findAttribute("isPrivate"));
    			tableau.put("isProtected",node.findAttribute("isProtected"));
    			tableau.put("isStatic",node.findAttribute("isStatic"));
    			tableau.put("isFinal",node.findAttribute("isFinal"));
       			
    			/*
    			JSONObject metadata=new JSONObject();
    			metadata.put("name",node.findAttribute("name"));
       			metadata.put("type",node.findAttribute("type"));
       			metadata.put("isPublic",node.findAttribute("isPublic"));
       			metadata.put("isPrivate",node.findAttribute("isPrivate"));
       			metadata.put("isProtected",node.findAttribute("isProtected"));
       			metadata.put("isStatic",node.findAttribute("isStatic"));
       			metadata.put("isFinal",node.findAttribute("isFinal"));
       			tableau.put(metadata);
       			
    			}
    		else{
 //   		sstab.put(node.getName());
 //   		tree2Json(node, sstab);
 //   		tableau.put(sstab);
    			tree2Json(node,sselt)
    			sselt.put("childs", sselt)
    			sselt.put(node, value)
    		}
    		
		}
    	//show(arbre,0);
    	//System.out.println(tableau);
    	
    }*/
	public static void show(TreeNode root,int tabspace){
		for (int i=0;i<= tabspace;i++) {
			System.out.print(" ");
		}
		System.out.println("-"+root.getName());
		Iterator<TreeNode> it = root.findChildren();
		tabspace++;
		while(it.hasNext()){
			show(it.next(), tabspace);
		}
	}
}
