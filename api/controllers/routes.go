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
	s.Router.HandleFunc("/myusers", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.GetMeUser))).Methods("GET")
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
	s.Router.HandleFunc("/itemsmy", middlewares.SetMiddlewareJSON(s.GetMyItemsWithPagination)).Methods("GET")
	s.Router.HandleFunc("/itemstop", middlewares.SetMiddlewareJSON(s.GetTop3Items)).Methods("GET")
	s.Router.HandleFunc("/items/paginate", middlewares.SetMiddlewareJSON(s.GetItemsWithPagination)).Methods("GET")
	s.Router.HandleFunc("/items/{id}", middlewares.SetMiddlewareJSON(s.GetItem)).Methods("GET")
	s.Router.HandleFunc("/items/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.UpdateItem))).Methods("PUT")
	s.Router.HandleFunc("/items/{id}", middlewares.SetMiddlewareAuthentication(s.DeleteItem)).Methods("DELETE")

	//Posts routes
	s.Router.HandleFunc("/tags", middlewares.SetMiddlewareJSON(s.CreateTag)).Methods("POST")
	s.Router.HandleFunc("/tags", middlewares.SetMiddlewareJSON(s.GetTags)).Methods("GET")
	s.Router.HandleFunc("/tags/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.UpdateTag))).Methods("PUT")
	s.Router.HandleFunc("/tags/{id}", middlewares.SetMiddlewareAuthentication(s.DeleteTag)).Methods("DELETE")

	//Balances routes
	s.Router.HandleFunc("/balances", middlewares.SetMiddlewareJSON(s.GetBalances)).Methods("GET")
	s.Router.HandleFunc("/mybalances/topup", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.TopupBalances))).Methods("POST")
	s.Router.HandleFunc("/mybalances/testtopup", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.TopupBalancesWithoutHE))).Methods("POST")
	s.Router.HandleFunc("/mybalances/activate", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.ActivateBalances))).Methods("POST")
	s.Router.HandleFunc("/mybalances/testactivate", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.ActivateBalancesWithoutHE))).Methods("POST")
	s.Router.HandleFunc("/mybalances/check", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.GetBalance))).Methods("GET")

	//Discounts routes
	s.Router.HandleFunc("/discounts", middlewares.SetMiddlewareJSON(s.CreateDiscount)).Methods("POST")
	s.Router.HandleFunc("/discounts", middlewares.SetMiddlewareJSON(s.GetDiscounts)).Methods("GET")
	s.Router.HandleFunc("/discountsbyname/{name}", middlewares.SetMiddlewareJSON(s.GetDiscountByName)).Methods("GET")
	s.Router.HandleFunc("/discountspaginate", middlewares.SetMiddlewareJSON(s.GetDiscountsWithPaginate)).Methods("GET")
	s.Router.HandleFunc("/discounts/{id}", middlewares.SetMiddlewareJSON(s.GetDiscount)).Methods("GET")
	s.Router.HandleFunc("/discounts/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.UpdateDiscount))).Methods("PUT")
	s.Router.HandleFunc("/discounts/{id}", middlewares.SetMiddlewareAuthentication(s.DeleteDiscount)).Methods("DELETE")

	//Transacts routes
	s.Router.HandleFunc("/transacts", middlewares.SetMiddlewareJSON(s.CreateTransactWithDisc)).Methods("POST")
	s.Router.HandleFunc("/testtransacts", middlewares.SetMiddlewareJSON(s.CreateTransactWithDiscWithoutHE)).Methods("POST")
	s.Router.HandleFunc("/transacts", middlewares.SetMiddlewareJSON(s.GetTransacts)).Methods("GET")
	s.Router.HandleFunc("/transactsmy", middlewares.SetMiddlewareJSON(s.GetMyTransact)).Methods("GET")
	s.Router.HandleFunc("/testtransactsmy", middlewares.SetMiddlewareJSON(s.GetMyTransactWithoutHE)).Methods("GET")
	s.Router.HandleFunc("/transacts/{id}", middlewares.SetMiddlewareJSON(s.GetTransact)).Methods("GET")
	s.Router.HandleFunc("/transacts/{id}", middlewares.SetMiddlewareJSON(middlewares.SetMiddlewareAuthentication(s.UpdateTransact))).Methods("PUT")
	s.Router.HandleFunc("/transacts/{id}", middlewares.SetMiddlewareAuthentication(s.DeleteTransact)).Methods("DELETE")

	s.Router.HandleFunc("/ckks", middlewares.SetMiddlewareJSON(s.CountQT)).Methods("POST")
	s.Router.HandleFunc("/test", middlewares.SetMiddlewareJSON(s.SpesificAverageTest)).Methods("GET")

}
