package persistence.utils;

import java.io.PrintWriter;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import javax.jdo.Extent;
import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManager;
import javax.jdo.PersistenceManagerFactory;
import javax.jdo.Query;
import javax.jdo.Transaction;
import javax.jdo.annotations.PrimaryKey;

import org.apache.commons.beanutils.PropertyUtils;

import servlets.utils.TreeNode;

import persistence.model.Product;

public class PersistenceHelper {
	private PersistenceManagerFactory pmf;
	private PersistenceManager pm;
	private Transaction tx;
	public PersistenceHelper(String parametersFile){
		pmf=JDOHelper.getPersistenceManagerFactory(parametersFile);
		pm=pmf.getPersistenceManager();
		tx=pm.currentTransaction();
//		tx.begin();
	}

	public void persist(Object o,Class T ){
//		PersistenceManager pm=pmf.getPersistenceManager();
//		Transaction tx=pm.currentTransaction();
		try
	        {
	        	tx.begin();
	            pm.makePersistent(T.cast(o));
	            tx.commit();
	        }
	        finally
	        {
	          //  closeTransaction(tx);
	        }
	}

	public List getAllInstancesOf(Class className){
		PersistenceManager pm=pmf.getPersistenceManager();
		Transaction tx=pm.currentTransaction();
		try
        {
            tx.begin();
            Extent e = pm.getExtent(className,false);
            Iterator it=e.iterator();
            ArrayList list = new ArrayList();
            while(it.hasNext())
            	list.add(it.next());
   //         tx.commit();
            return list;
        }
        catch (Exception e)
        {
            System.out.println("Impossible de recuperer les objets demandes depuis la source de donnees : " + e.getMessage());
        }
        finally
        {
 //          closeTransaction(tx);
        }
		return null;
	}
	private Field getIdField(Class<?> c){
		for (Field f : c.getDeclaredFields()) {
			if (f.isAnnotationPresent(PrimaryKey.class))
				return f;
		}
		if (c.getSuperclass()== c) return null;
		return getIdField(c.getSuperclass());
	}
	private ArrayList<Field> getAllDeclaredFields(Class<?> c){
		// returns the list of declared fields  in the class and in it's superclass
		ArrayList<Field> fieldList= new ArrayList<Field>();
		if( c.getSuperclass()!=null && c.getSuperclass()!=c)
			fieldList=getAllDeclaredFields(c.getSuperclass());
		for (Field f : c.getDeclaredFields()) {
			if (!f.getName().startsWith("jdo")){
				fieldList.add(f);
			}
		}
		return fieldList;
	}
	public void update(Object o) {
		PersistenceManager pm=pmf.getPersistenceManager();
		Transaction tx=pm.currentTransaction();
		Class<? extends Object> T = o.getClass();
		String id=getIdField(T).getName();
		String filter;
		try {
			filter = id+"=="+PropertyUtils.getProperty(o, id);
			System.out.println("filter ="+ filter);
				tx.begin();
	    		Query q=pm.newQuery(T,filter);
	    		Collection c= (Collection)q.execute();
	    		System.out.println("nombre d'objets a mettre a jour: "+c.size());
	    		Iterator i=c.iterator();
	    		Object elt= i.next();
	    		String fieldName;
	    		for (Field  f:getAllDeclaredFields(T) ) {
	    			fieldName=f.getName();
					PropertyUtils.setProperty(T.cast(elt), fieldName, PropertyUtils.getProperty(o,fieldName));
	    			//System.out.println("===> "+fieldName+"= "+PropertyUtils.getProperty(T.cast(elt), fieldName));
				}
	    		pm.makePersistent(T.cast(elt));
	        	tx.commit();
        	}
	    catch (Exception e) {
	    	System.out.println("Erreur lors de la mise a jour : " + e.getMessage());
	    	e.printStackTrace();
	    }
	    finally
        {
        	//closeTransaction(tx);
        }
	}
	public void update(Object o,Class<?> T,String idName, String att,Class attType,Object newVal) {
		PersistenceManager pm=pmf.getPersistenceManager();
		Transaction tx=pm.currentTransaction();
		try {
		
			String field=String.valueOf(att.charAt(0)).toUpperCase()+att.substring(1);
			//String filter = " =="+(T.cast(o).getClass().getMethod("get"+field).invoke(T.cast(o)));
			//filter=att.toLowerCase()+filter;
			idName=String.valueOf(idName.charAt(0)).toUpperCase()+idName.substring(1);
			String filter=idName.toLowerCase()+" =="+(T.cast(o).getClass().getMethod("get"+idName).invoke(T.cast(o)));
			System.out.println("\n\n\n\n\n\n\n\n\n\n filter: "+filter);
	    		tx.begin();
	    		Query q=pm.newQuery(T,filter);
	    		Collection c= (Collection)q.execute();
	    		Iterator iter=c.iterator();
	    		System.out.println("nombre d'objets a mettre a jour: "+c.size());
	        	while (iter.hasNext())
		        {
		            Object obj = iter.next();
		            Product.class.getMethod("set"+field).invoke(Product.class.cast(obj),123.0);
		            persist(T.cast(obj),T.getClass());
		        /*  
		           	Field att[]=T.getClass().getFields();
		            	for( int i=0;i<att.length;i++){
		            	String attname=att[i].getName();	
		            	
		            		if (!attname.equals(id))
		            			
		            	T.getClass().getField(attname).set(T.cast(obj), T.getClass().getField(attname).get(T.cast(o)));
		            	}
		        }
		        
				tx.begin();
				persist(T.cast(o), T);*/
		        }
	        	tx.commit();
        	}
	    catch (Exception e) {
	    	System.out.println("Erreur lors de la mise a jour : " + e.getMessage());
	       	}
	    finally
        {
        	//closeTransaction(tx);
        }
	}

	public List getInstancesWhere(Class className,String filter,String orderBy){
		PersistenceManager pm=pmf.getPersistenceManager();
		Transaction tx=pm.currentTransaction(); 
		ArrayList list=new ArrayList();
		try
	        {
	            tx.begin();

	            Extent e=pm.getExtent(className,false);
	            Query q=pm.newQuery(e, filter);
	            if(orderBy!=null && !orderBy.isEmpty()) q.setOrdering(orderBy);
	            Collection c=(Collection)q.execute();
	 //           tx.commit();
	            Iterator it=c.iterator();
	            while(it.hasNext())
	            	list.add(it.next());
	            
	        }
	        finally
	        {
	      //      closeTransaction(tx);
	        }
		
		return  list;
		
	}
/*	public void printResultList(Collection c,PrintWriter out){
        Iterator iter = c.iterator();
        while (iter.hasNext())
        {
            Object obj = iter.next();
            out.println(obj);
        }
        out.flush();
	}*/
	public void printResultList(List list,PrintWriter out){
        Iterator iter = list.iterator();
        while (iter.hasNext())
        {
            Object obj = iter.next();
            out.println(obj);
        }
        out.flush();
	}
	public long DeleteInstancesWhere(Class type,String filter){
		PersistenceManager pm=pmf.getPersistenceManager(); 
		Transaction tx = pm.currentTransaction();
		 long n=0;
	        try
	        {
	            tx.begin();
	            Extent e=pm.getExtent(type,false);
	            Query q=pm.newQuery(e, filter);
	            Collection c=(Collection)q.execute();
	            if(c==null || c.size()==0) System.out.println("Element to delete not found");
	            else
	            {
	            	Iterator it=c.iterator();
	            	while(it.hasNext()){
	            		pm.deletePersistent(type.cast(it.next()));
	            	}
	            }
	            System.out.println(n+ " "+type.getName()+ " supprimes!");
	            tx.commit();
	        }
	        finally
	        {
	     //      closeTransaction(tx);
	        }
	        return n;
	}
	public long DeleteAllInstancesOf(Class className){
		PersistenceManager pm=pmf.getPersistenceManager(); 
		Transaction tx = pm.currentTransaction();
		 long n=0;
	        try
	        {
	            tx.begin();
	            Query q = pm.newQuery(className);
	            n = q.deletePersistentAll();
	            System.out.println(n+ " "+className.getName()+ " supprimes!");
	            tx.commit();
	        }
	        finally
	        {
	       //    closeTransaction(tx);
	        }
	        return n;
	}
	public void closeTransaction(Transaction tx){
	PersistenceManager pm=pmf.getPersistenceManager();	
		if (tx.isActive())
            {
                tx.rollback();
            }
            pm.close();
}
}
