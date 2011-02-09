package persistence.resources.articles;

import javax.jdo.annotations.Discriminator;
import javax.jdo.annotations.DiscriminatorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.Inheritance;
import javax.jdo.annotations.InheritanceStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;
 

@PersistenceCapable(identityType=IdentityType.APPLICATION,table="Product")
@Inheritance(strategy=InheritanceStrategy.NEW_TABLE)
@Discriminator(strategy=DiscriminatorStrategy.CLASS_NAME)
public class Product
{	
	@PrimaryKey(name="serial")
	protected long serial=0;
	@Persistent
    protected String name=null;
	@Persistent
    protected String description=null;
	@Persistent
    protected double price=0.0;

    protected Product()
    {
    }

    public Product(long serial,String name, String description, double price)
    {	
    	this.serial=serial;
        this.name = name;
        this.description = description;
        this.price = price;
    }
    
    
    public long getSerial() {
		return serial;
	}
    
	public String getName()
    {
        return name;
    }

    public String getDescription()
    {
        return description;
    }

    public double getPrice()
    {
        return price;
    }

	public void setSerial(long serial) {
		this.serial = serial;
	}

    public void setName(String name)
    {
        this.name = name;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    public void setPrice(double price)
    {
        this.price = price;
    }

    public String toString()
    {
        return "Product : " + name + " [" + description + "]" + price;
    }
}