package persistence.model;

import javax.jdo.annotations.Discriminator;
import javax.jdo.annotations.DiscriminatorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.Inheritance;
import javax.jdo.annotations.InheritanceStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;
  
@PersistenceCapable(identityType=IdentityType.APPLICATION,table="Book")
@Inheritance(strategy=InheritanceStrategy.NEW_TABLE)
@Discriminator(strategy=DiscriminatorStrategy.CLASS_NAME)
public class Book extends Product
{	
	@Persistent
    protected String author=null;
	@Persistent
    protected String isbn=null;
	@Persistent
    protected String publisher=null;
	
    protected Book()
    {
        super();
    }

    public Book(long serial,String name, String description, double price, String author, String isbn, String publisher)
    {
        super(serial, name,description,price);
        this.author = author;
        this.isbn = isbn;
        this.publisher = publisher;
    }

    public String getAuthor()
    {
        return author;
    }

    public String getIsbn()
    {
        return isbn;
    }

    public String getPublisher()
    {
        return publisher;
    }

    public void setAuthor(String author)
    {
        this.author = author;
    }

    public void setIsbn(String isbn)
    {
        this.isbn = isbn;
    }

    public void setPublisher(String publisher)
    {
        this.publisher = publisher;
    }

    public String toString()
    {
        return "Book : " + author + " - " + name +" - " + isbn + " - " +publisher +" - " +price;
    }
}