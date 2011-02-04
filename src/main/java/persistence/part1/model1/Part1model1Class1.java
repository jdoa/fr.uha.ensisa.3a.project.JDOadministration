package persistence.part1.model1;

import javax.jdo.annotations.Discriminator;
import javax.jdo.annotations.DiscriminatorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.PrimaryKey;
@PersistenceCapable(identityType=IdentityType.APPLICATION,table="Part1model1Class1")
@Discriminator(strategy=DiscriminatorStrategy.CLASS_NAME)
public class Part1model1Class1 {
	@PrimaryKey
	String pKPersistence1Model1Class2;
}
