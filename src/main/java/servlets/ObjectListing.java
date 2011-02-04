package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashSet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.beanutils.PropertyUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import persistence.utils.PersistenceHelper;

public class ObjectListing extends HttpServlet {
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {
		//super.doGet(req, res);
		res.setContentType("json");
		PrintWriter out = res.getWriter();
		JSONArray jsonRep=new JSONArray();
		ArrayList<Object> objectList= new ArrayList<Object>();
		HashSet<String> classNamesList=new HashSet<String>();
		String fqn=req.getParameter("fqn");
		//String filter=URLDecoder.decode(req.getParameter("filter"),"UTF-8");
		String filter=req.getParameter("filter");
		String orderBy=req.getParameter("orderBy");
		String sens=req.getParameter("sens");
		long limit= Long.parseLong(req.getParameter("limit"));
		long resultMin=0;
		long resultMax=0;
		if(sens.compareTo("0")!=0){
			resultMin=Long.parseLong(req.getParameter("resultMin"));
			resultMax=Long.parseLong(req.getParameter("resultMax"));
		}
		
		PersistenceHelper helper=PersistenceHelper.getInstance("datanucleus.properties");
		try {

			Class<?> c=Class.forName(fqn);
			if(sens.compareTo("0")==0) 
				objectList.addAll(helper.getInstancesWhere(c,filter,orderBy));
			else
				objectList.addAll(helper.getInstancesWhere(c,filter,orderBy,resultMin,resultMax));
			for (Object o : objectList) {
				JSONObject objet= new JSONObject();
				for (Field f : helper.getAllDeclaredFields(c)) {
					objet.put(f.getName(), PropertyUtils.getProperty(o,f.getName()));
				}
				jsonRep.put(objet);
				if(jsonRep.length()==limit) break;
			}
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		System.out.println("fqn :"+fqn);
		System.out.println("filter :"+filter);
		System.out.println("orderBy :"+orderBy);
		System.out.println("sens :"+sens);
		System.out.println("limit:"+limit);
		System.out.println("resultMin :"+resultMin);
		System.out.println("resultMax :"+resultMax);
		//jsonRep.length();
		if(sens.compareTo("0")==0){
		JSONObject obj= new JSONObject();
			try {
				obj.put("size", objectList.size());
				jsonRep.put(obj);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		System.out.println(jsonRep);
		out.print(jsonRep);
		out.flush();
		out.close();
		//out.flush();
	}
}
