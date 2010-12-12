package persistence.utils;

import java.io.PrintStream;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.Iterator;

import javax.jdo.Extent;
import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManager;
import javax.jdo.PersistenceManagerFactory;
import javax.jdo.Query;
import javax.jdo.Transaction;

import persistence.model.Book;
import persistence.model.Product;

public class PersistenceHelper {
	private PersistenceManagerFactory pmf;
	
	public PersistenceHelper(String parametersFile){
		pmf=JDOHelper.getPersistenceManagerFactory(parametersFile);
	}
	public void persistProduct(Product product ){
		PersistenceManager pm=pmf.getPersistenceManager();
		Transaction tx=pm.currentTransaction();
		try
	        {
	        	tx.begin();
	            pm.makePersistent(product);
	            tx.commit();
	        }
	        finally
	        {
	            closeTransaction(tx);
	        }
	}
	public void persistBook(Book book ){
		PersistenceManager pm=pmf.getPersistenceManager();
		Transaction tx=pm.currentTransaction();
		try
	        {
	        	tx.begin();
	            pm.makePersistent(book);
	            tx.commit();
	        }
	        finally
	        {
	            closeTransaction(tx);
	        }
	}
	public Extent getAllInstancesOf(Class className){
		PersistenceManager pm=pmf.getPersistenceManager();
		Transaction tx=pm.currentTransaction();
		try
        {
            tx.begin();
            Extent e = pm.getExtent(className,false);
            tx.commit();
            return e;
        }
        catch (Exception e)
        {
            System.out.println("Impossible de recuperer les objets demandes depuis la source de donnees : " + e.getMessage());
        }
        finally
        {
           closeTransaction(tx);
        }
		return null;
	}
	
	public void updateProduct(Product product){
		PersistenceManager pm=pmf.getPersistenceManager();
		Transaction tx=pm.currentTransaction();
		String filter="serial =="+product.getSerial();
      
        try{
	    		tx.begin();
	    		Query q=pm.newQuery(product.getClass(),filter);
	    		Collection c= (Collection)q.execute();
	    		Iterator iter=c.iterator();
	        	while (iter.hasNext())
		        {
		            Object obj = iter.next();
					if (obj instanceof Product)
			        {
			            Product b = (Product)obj;
			            b.setDescription(product.getDescription());
			            b.setName(product.getName());
			            b.setPrice(product.getPrice());
			        }
		        }
	        	tx.commit();
        	}
	    catch (Exception e) {
	    	System.out.println("Erreur lors de la mise a jour : " + e.getMessage());
	       	}
	    finally
        {
        	closeTransaction(tx);
        }
	}
	public void updateBook(Book book){
		PersistenceManager pm=pmf.getPersistenceManager();
		Transaction tx=pm.currentTransaction();
		String filter="serial =="+book.getSerial();        
        try{
	    		tx.begin();
	    		Query q=pm.newQuery(book.getClass(),filter);
	    		Collection c=(Collection)q.execute();
	    		Iterator iter=c.iterator();
	        	while (iter.hasNext())
		        {	
		            Object obj = iter.next();
					if (obj instanceof Book)
			        {   
						Book b = (Book)obj;
			            b.setAuthor(book.getAuthor());
			            b.setDescription(book.getDescription());
			            b.setIsbn(book.getIsbn());
			            b.setName(book.getName());
			            b.setPrice(book.getPrice());
			            b.setPublisher(book.getPublisher());
			        }
		        }
	        	tx.commit();
        	}
	    catch (Exception e) {
	    	System.out.println("Erreur lors de la mise a jour : " + e.getMessage());
	       	}
	    finally
        {
        	closeTransaction(tx);
        }
	}
	public Collection getInstancesWhere(Class className,String filter,String orderBy){
		PersistenceManager pm=pmf.getPersistenceManager();
		Transaction tx=pm.currentTransaction(); 
		Collection c;
		try
	        {
	            tx.begin();

	            Extent e=pm.getExtent(className,false);
	            Query q=pm.newQuery(e, filter);
	            if(orderBy!=null && !orderBy.isEmpty()) q.setOrdering(orderBy);
	            c=(Collection)q.execute();
	            tx.commit();
	            
	        }
	        finally
	        {
	            closeTransaction(tx);
	        }
		
		return  c;
		
	}
	public void printResultList(Collection c,PrintWriter out){
        Iterator iter = c.iterator();
        while (iter.hasNext())
        {
            Object obj = iter.next();
            out.println(obj);
        }
        out.flush();
	}
	public void printResultList(Extent e,PrintWriter out){
        Iterator iter = e.iterator();
        while (iter.hasNext())
        {
            Object obj = iter.next();
            out.println(obj);
        }
        out.flush();
	}
	public long DeleteInstancesOf(Class className){
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
	           closeTransaction(tx);
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
