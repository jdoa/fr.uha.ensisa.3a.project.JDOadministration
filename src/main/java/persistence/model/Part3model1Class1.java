package persistence.model;

import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable(identityType=IdentityType.APPLICATION,table="Part3model1Class1")

public class Part3model1Class1 {
	@PrimaryKey(name="mon_id")
	protected long mon_id;
	@Persistent
	protected String monAttribut;
	
	
	public Part3model1Class1(long mon_id, String monAttribut) {
		super();
		this.mon_id = mon_id;
		this.monAttribut = monAttribut;
	}
	public long getMon_id() {
		return mon_id;
	}
	public void setMon_id(long mon_id) {
		this.mon_id = mon_id;
	}
	public String getMonAttribut() {
		return monAttribut;
	}
	public void setMonAttribut(String monAttribut) {
		this.monAttribut = monAttribut;
	}
	@Override
	public String toString() {
		return "Part3model1Class1 mon_id=" + mon_id + ", monAttribut="
				+ monAttribut;
	}
	
	
	
}
