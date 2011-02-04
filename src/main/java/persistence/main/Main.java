package persistence.main;

import java.io.PrintWriter;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;

import javax.jdo.annotations.PrimaryKey;

import persistence.model.Book;
import persistence.model.Part3model1Class1;
import persistence.model.Product;
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
    public static void main(String args[]) throws IllegalArgumentException, IllegalAccessException, InvocationTargetException, NoSuchMethodException, InterruptedException
    {
        PersistenceHelper helper=PersistenceHelper.getInstance("datanucleus.properties");        
         System.out.println("Affichage du Contenu de la base de donnee:");
         PrintWriter out= new PrintWriter(System.out);
         helper.printResultList(helper.getAllInstancesOf(Book.class),out);
         helper.printResultList(helper.getAllInstancesOf(Product.class),out);
         helper.printResultList(helper.getAllInstancesOf(Part3model1Class1.class), out);
 		Book b= new Book(1200, "test book", "book desgined for tests", 187.98, "junit", "1092883TEST", "Tester as publisher");
 		Book b2= new Book(1201, "test book", "book desgined for tests", 187.28, "junit", "1092883TEST", "Tester as publisher");
 		Part3model1Class1 x=new Part3model1Class1(1,"lol");
 		helper.DeleteInstancesWhere(Part3model1Class1.class,"mon_id==1");
 		//x.setpKNoPersistenceModel1Class1(1);
 		helper.persist(x, x.getClass());
 		System.out.println("affichage après rajout de test");
 		helper.printResultList(helper.getAllInstancesOf(Part3model1Class1.class), out);
 		
 		//  PersistenceHelper helper=PersistenceHelper.getInstance("datanucleus.properties");
	 //  helper.DeleteAllInstancesOf(Book.class);
	  //  helper.persist(b2, b2.getClass());
	 //   helper.persist(b,b.getClass());
	//    helper.printResultList(helper.getAllInstancesOf(Book.class),out);
	    //helper.DeleteInstancesWhere(Book.class,"serial =="+b.getSerial());
	    //b.setPrice(187.28);
	  //  List list=(List) helper.getInstancesWhere(Book.class, "price== 187.98", null);
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
 		helper.printResultList(helper.getInstancesWhere(Product.class, "", "name asc"), out);
    }
}


