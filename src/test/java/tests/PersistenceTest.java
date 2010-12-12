package tests;

import junit.framework.Assert;

import org.junit.Test;
import persistence.model.Book;
import persistence.model.Product;
import persistence.utils.PersistenceHelper;


public class PersistenceTest {
	@Test
	public void delete(){
	    PersistenceHelper helper=new PersistenceHelper("datanucleus.properties");
	    helper.DeleteInstancesOf(Book.class);
	    int size = helper.getInstancesWhere(Book.class, "", null).size();
	    Assert.assertEquals(size, 0);
	}
	@Test
	public void insertAndSelect(){
		Book b= new Book(1200, "test book", "book desgined for tests", 187.98, "junit", "1092883TEST", "Tester as publisher");
	    PersistenceHelper helper=new PersistenceHelper("datanucleus.properties");
	    helper.DeleteInstancesOf(Book.class);
	    helper.persistBook(b);
	    int size = helper.getInstancesWhere(Book.class, "serial==1200", null).size();
	    Assert.assertEquals(size, 1);
	}
	@Test
	public void update(){
		Book b= new Book(1200, "test book", "book desgined for tests", 187.98, "junit", "1092883TEST", "Tester as publisher");
	    PersistenceHelper helper=new PersistenceHelper("datanucleus.properties");
	    helper.DeleteInstancesOf(Book.class);
	    helper.persistBook(b);
	    b.setPrice(198.99);
	    helper.updateBook(b);
	    int size = helper.getInstancesWhere(Book.class, "serial==1200 && price==198.99", null).size();
	    Assert.assertEquals(size, 1);
	}
	@Test
	public void init(){
	        Product product1 = new Product(10,"PC DELL","desktop intel p4,ram 3Go,DD 250",600);
	        Book book1 = new Book(11,"HP Bible","historiques des produits HP",100,"hewlet-packard", "12345678", "Hp factory");
	        Product product = new Product(12,"souris logitech","souris sans fil batterie rechargeable",60);
	        Book book = new Book(13,"Les miserables","un chef d'oeuvre de victor hugo",150,"Victory Hugo", "1876", "EDITIONS Blanche neige");
	        PersistenceHelper helper=new PersistenceHelper("datanucleus.properties");
	        helper.DeleteInstancesOf(Book.class);
	        helper.DeleteInstancesOf(Product.class);
	        helper.persistBook(book);
	        helper.persistBook(book1);
	        helper.persistProduct(product);
	        helper.persistProduct(product1);
	}

}
