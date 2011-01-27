package persistence.main;

import java.beans.PropertyDescriptor;
import java.io.PrintWriter;
import java.io.ObjectInputStream.GetField;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import javax.jdo.annotations.PrimaryKey;

import org.apache.commons.beanutils.PropertyUtils;

import junit.framework.Assert;

import persistence.model.*;
import persistence.utils.PersistenceHelper;


public class Main
{	
	private static Field getIdField(Class<?> c){
		for (Field f : c.getDeclaredFields()) {
			if (f.isAnnotationPresent(PrimaryKey.class))
				return f;
		}
		if (c.getSuperclass()== c) return null;
		return getIdField(c.getSuperclass());
	}
    public static void main(String args[]) throws IllegalArgumentException, IllegalAccessException, InvocationTargetException, NoSuchMethodException
    {
        PersistenceHelper helper=new PersistenceHelper("datanucleus.properties");        
         System.out.println("Affichage du Contenu de la base de donnee:");
         PrintWriter out= new PrintWriter(System.out);
         helper.printResultList(helper.getAllInstancesOf(Book.class),out);
         helper.printResultList(helper.getAllInstancesOf(Product.class),out);

 		Book b= new Book(1200, "test book", "book desgined for tests", 187.98, "junit", "1092883TEST", "Tester as publisher");
 		Book b2= new Book(1201, "test book", "book desgined for tests", 187.28, "junit", "1092883TEST", "Tester as publisher");
	  //  PersistenceHelper helper=new PersistenceHelper("datanucleus.properties");
	  //  helper.DeleteAllInstancesOf(Book.class);
	  //  helper.persist(b2, b2.getClass());
	  //  helper.persist(b,b.getClass());
	  //  helper.printResultList(helper.getAllInstancesOf(Book.class),out);
	    //helper.DeleteInstancesWhere(Book.class,"serial =="+b.getSerial());
	    //b.setPrice(187.28);
	    List list=(List) helper.getInstancesWhere(Book.class, "price== 187.98", null);
	   // Book bb=Book.class.cast(list.get(0));
	   // helper.update(bb, Book.class, "serial", "price", Long.class, 187.28);
	    //helper.persist(Book.class.cast(list.get(0)), Book.class);
	    //b.setPrice(198.99);
	   // ArrayList c= (ArrayList) helper.getAllInstancesOf(b.getClass());
	   // Iterator it=c.iterator();
	    //while( Iterator.has)
	    //helper.update(b ,b.getClass(),"price",double.class,198.99);
	 //   Product p= new Product(1987, "name", "description", 1.1);
     //   System.out.println("2 Affichage du Contenu de la base de donnee:");
	  //  helper.printResultList(helper.getAllInstancesOf(Book.class),out);
	  //  System.out.println("---------------------");
	   //PropertyUtils.getProperty(bean, name)
	  //  System.out.println(PropertyUtils.getProperty(p, getIdField(p.getClass()).getName()));
	  //  System.out.println(PropertyUtils.getProperty(b, getIdField(b.getClass()).getName()));
        
    }
}


