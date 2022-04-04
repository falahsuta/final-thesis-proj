package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"

	"finalthesisproject/api/auth"
	"finalthesisproject/api/models"
	"finalthesisproject/api/responses"
	"finalthesisproject/api/utils/formaterror"
	"github.com/gorilla/mux"
)

func (server *Server) CreateDiscount(w http.ResponseWriter, r *http.Request) {

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	discount := models.Discount{}
	err = json.Unmarshal(body, &discount)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	err = discount.Validate()
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	_, err = auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	discountCreated, err := discount.SaveItem(server.DB)
	if err != nil {
		formattedError := formaterror.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, formattedError)
		return
	}
	w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.URL.Path, discountCreated.ID))
	responses.JSON(w, http.StatusCreated, discountCreated)
}

func (server *Server) GetDiscounts(w http.ResponseWriter, r *http.Request) {
	discount := models.Discount{}

	discounts, err := discount.FindAllItems(server.DB)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	responses.JSON(w, http.StatusOK, discounts)
}

func (server *Server) GetDiscountsWithPaginate(w http.ResponseWriter, r *http.Request) {
	discount := models.Discount{}
	item := models.Item{}

	pagination := item.GeneratePaginationFromRequest(r)

	discounts, err := discount.FindAllItemsWithPaginate(server.DB, &pagination)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	responses.JSON(w, http.StatusOK, discounts)
}

func (server *Server) GetDiscount(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	pid, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	discount := models.Discount{}

	discountReceived, err := discount.FindItemByID(server.DB, pid)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	responses.JSON(w, http.StatusOK, discountReceived)
}

func (server *Server) GetDiscountByName(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	pid, _ := vars["name"]

	//fmt.Println(vars)
	//fmt.Println(pid)
	//if err != nil {
	//	responses.ERROR(w, http.StatusBadRequest, err)
	//	return
	//}

	discount := models.Discount{}

	discountReceived, err := discount.FindItemByName(server.DB, pid)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusOK, discountReceived)
}

func (server *Server) UpdateDiscount(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)

	// Check if the post id is valid
	pid, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	//CHeck if the auth token is valid and  get the user id from it
	_, err = auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	// Check if the post exist
	discount := models.Discount{}
	err = server.DB.Debug().Model(models.Discount{}).Where("id = ?", pid).Take(&discount).Error
	if err != nil {
		responses.ERROR(w, http.StatusNotFound, errors.New("Post not found"))
		return
	}

	// Read the data posted
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	// Start processing the request data
	discountUpdate := models.Discount{}
	err = json.Unmarshal(body, &discountUpdate)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	discountUpdate.Prepare()
	err = discountUpdate.Validate()
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	discountUpdate.ID = discount.ID //this is important to tell the model the post id to update, the other update field are set above

	discountUpdated, err := discountUpdate.UpdateAnItem(server.DB)

	if err != nil {
		formattedError := formaterror.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, formattedError)
		return
	}
	responses.JSON(w, http.StatusOK, discountUpdated)
}

func (server *Server) DeleteDiscount(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)

	// Is a valid post id given to us?
	pid, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	// Is this user authenticated?
	_, err = auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	// Check if the post exist
	discount := models.Discount{}
	err = server.DB.Debug().Model(models.Post{}).Where("id = ?", pid).Take(&discount).Error
	if err != nil {
		responses.ERROR(w, http.StatusNotFound, errors.New("Unauthorized"))
		return
	}


	_, err = discount.DeleteAItem(server.DB, pid)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	w.Header().Set("Entity", fmt.Sprintf("%d", pid))
	responses.JSON(w, http.StatusNoContent, "")
}

