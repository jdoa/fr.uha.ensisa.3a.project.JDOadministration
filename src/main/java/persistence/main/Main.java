package persistence.main;

import java.io.PrintWriter;

import persistence.model.*;
import persistence.utils.PersistenceHelper;


public class Main
{	

    public static void main(String args[])
    {
        PersistenceHelper helper=new PersistenceHelper("datanucleus.properties");        
         System.out.println("Affichage du Contenu de la base de donnee:");
         PrintWriter out= new PrintWriter(System.out);
         helper.printResultList(helper.getAllInstancesOf(Book.class),out);
         helper.printResultList(helper.getAllInstancesOf(Product.class),out);

        

        
    }
}
