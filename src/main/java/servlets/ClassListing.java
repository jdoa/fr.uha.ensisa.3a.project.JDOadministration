package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashSet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import servlets.utils.JsonHelper;
import servlets.utils.ReflexionHelper;



public class ClassListing extends HttpServlet {
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {
		
		res.setContentType("jsonp");
//		res.setContentType("text/x-json");
		Connection con = null;
		Statement instruction = null;
		ResultSet resultat = null;
		PrintWriter out = res.getWriter();
		//JSONObject jsonRep=new JSONObject();
		HashSet<Class> classList= new HashSet<Class>();
		HashSet<String> classNamesList=new HashSet<String>();
			
		try {
		/*	Class.forName("com.mysql.jdbc.Driver");
			con = DriverManager.getConnection("jdbc:mysql://localhost/jdo",
					"root", "");
			instruction = con.createStatement();

			resultat = instruction
					.executeQuery("SELECT class_name FROM nucleus_tables");
			while (resultat.next()) {
				classList.add(resultat.getString("class_name"));
//				jsonRep.accumulate("class_name", resultat.getString("class_name"));
			}
			*/
			for (Package pack : Package.getPackages()) {
		//		System.out.println("package : "+pack.getName());
				classList.addAll(ReflexionHelper.getAllClasses("persistence"));
			}
			for (Class class_ : classList) {
				classNamesList.add(class_.getName());
				System.out.println(class_.getName());
			}
			out.print(JsonHelper.process(classNamesList));
			//out.print(jsonRep);
			out.flush();
			out.close();
			System.out.println("filter :"+req.getParameter("filter"));
			System.out.println("limit :"+req.getParameter("limit"));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}