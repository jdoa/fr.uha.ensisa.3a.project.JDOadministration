package persistence.part2.model1;

import javax.jdo.annotations.Discriminator;
import javax.jdo.annotations.DiscriminatorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.PrimaryKey;
@PersistenceCapable(identityType=IdentityType.APPLICATION,table="Part2model1Class2")
@Discriminator(strategy=DiscriminatorStrategy.CLASS_NAME)
public class Part2model1Class2 {
	@PrimaryKey
	String pKPersistence2Class2;

	public String getpKPersistence2Class2() {
		return pKPersistence2Class2;
	}

	public void setpKPersistence2Class2(String pKPersistence2Class2) {
		this.pKPersistence2Class2 = pKPersistence2Class2;
	}
	
}
