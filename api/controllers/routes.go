package controllers

import "finalthesisproject/api/middlewares"

func (s *Server) initializeRoutes() {

	// Home Route
	s.Router.HandleFunc("/", middlewares.SetMiddlewareJSON(s.Home)).Methods("GET")

	// Login Route
	s.Router.HandleFunc("/login", middlewares.SetMiddlewareJSON(s.Login)).Methods("POST")

	//Users routes
	s.Router.HandleFunc("/users", middlewares.SetMiddlewareJSON(s.CreateUser)).Methods("POST")
	s.Router.HandleFunc("/users", middlewares.SetMiddlewareJSON(s.GetUsers)).Methods("GET")
	s.Router.HandleFunc("/users/{id}", middlewares.SetMiddlewareJSON(s.GetUser)).Methods("GET")
	s.Router.HandleFunc("/users/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.UpdateUser))).Methods("PUT")
	s.Router.HandleFunc("/users/{id}", middlewares.SetMiddlewareAuthentication(s.DeleteUser)).Methods("DELETE")

	//Posts routes
	s.Router.HandleFunc("/posts", middlewares.SetMiddlewareJSON(s.CreatePost)).Methods("POST")
	s.Router.HandleFunc("/posts", middlewares.SetMiddlewareJSON(s.GetPosts)).Methods("GET")
	s.Router.HandleFunc("/posts/{id}", middlewares.SetMiddlewareJSON(s.GetPost)).Methods("GET")
	s.Router.HandleFunc("/posts/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.UpdatePost))).Methods("PUT")
	s.Router.HandleFunc("/posts/{id}", middlewares.SetMiddlewareAuthentication(s.DeletePost)).Methods("DELETE")

	//Posts routes
	s.Router.HandleFunc("/items", middlewares.SetMiddlewareJSON(s.CreateItem)).Methods("POST")
	s.Router.HandleFunc("/items", middlewares.SetMiddlewareJSON(s.GetItems)).Methods("GET")
	s.Router.HandleFunc("/items/paginate", middlewares.SetMiddlewareJSON(s.GetItemsWithPagination)).Methods("GET")
	s.Router.HandleFunc("/items/{id}", middlewares.SetMiddlewareJSON(s.GetItem)).Methods("GET")
	s.Router.HandleFunc("/items/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.UpdateItem))).Methods("PUT")
	s.Router.HandleFunc("/items/{id}", middlewares.SetMiddlewareAuthentication(s.DeleteItem)).Methods("DELETE")

	//Posts routes
	s.Router.HandleFunc("/tags", middlewares.SetMiddlewareJSON(s.CreateTag)).Methods("POST")
	s.Router.HandleFunc("/tags", middlewares.SetMiddlewareJSON(s.GetTags)).Methods("GET")
	s.Router.HandleFunc("/tags/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.UpdateTag))).Methods("PUT")
	s.Router.HandleFunc("/tags/{id}", middlewares.SetMiddlewareAuthentication(s.DeleteTag)).Methods("DELETE")

	s.Router.HandleFunc("/ckks", middlewares.SetMiddlewareJSON(s.CountCP)).Methods("POST")

}
