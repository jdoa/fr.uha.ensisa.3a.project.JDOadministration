package persistence.contraintes.materielles;

import javax.jdo.annotations.Discriminator;
import javax.jdo.annotations.DiscriminatorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.PrimaryKey;
@PersistenceCapable(identityType=IdentityType.APPLICATION,table="Part2model1Class1")
@Discriminator(strategy=DiscriminatorStrategy.CLASS_NAME)
public class Part2model1Class1 {
	@PrimaryKey
	String pKPersistence1Class1;

	public Part2model1Class1(String pKPersistence1Class1) {
		super();
		this.pKPersistence1Class1 = pKPersistence1Class1;
	}

	public String getpKPersistence1Class1() {
		return pKPersistence1Class1;
	}

	public void setpKPersistence1Class1(String pKPersistence1Class1) {
		this.pKPersistence1Class1 = pKPersistence1Class1;
	}

	@Override
	public String toString() {
		return "Part2model1Class1 [pKPersistence1Class1="
				+ pKPersistence1Class1 + "]";
	}
	
}
