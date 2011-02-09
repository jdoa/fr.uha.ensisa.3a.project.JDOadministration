package persistence.resources.locaux;

import javax.jdo.annotations.Discriminator;
import javax.jdo.annotations.DiscriminatorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.PrimaryKey;
@PersistenceCapable(identityType=IdentityType.APPLICATION,table="Part1model1Class2")
@Discriminator(strategy=DiscriminatorStrategy.CLASS_NAME)
public class ContratBail {
	@PrimaryKey
	String pKPersistence1Model1Class1;
}
