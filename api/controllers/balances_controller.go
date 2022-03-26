package controllers

import (
	"encoding/json"
	"errors"
	"finalthesisproject/api/auth"
	"finalthesisproject/api/models"
	"finalthesisproject/api/responses"
	"finalthesisproject/api/utils/formaterror"
	"fmt"
	"io/ioutil"
	"net/http"
)

func (server *Server) GetBalances(w http.ResponseWriter, r *http.Request) {
	balance := models.Balance{}

	balances, err := balance.FindAllBalances(server.DB)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	responses.JSON(w, http.StatusOK, balances)
}

func (server *Server) GetBalance(w http.ResponseWriter, r *http.Request) {
	balance := models.Balance{}

	uid, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	balances, err := balance.FindMyBalances(server.DB, uid)

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	responses.JSON(w, http.StatusOK, balances)
}


func (server *Server) ActivateBalances(w http.ResponseWriter, r *http.Request) {

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	balance := models.Balance{}
	err = json.Unmarshal(body, &balance)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}


	uid, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	mybalance, err := balance.FindMyBalances(server.DB, uid)
	if mybalance.ID != 0 {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}


	balance.StartAndUpdate(uid)

	balanceCreated, err := balance.SaveItem(server.DB)
	if err != nil {
		formattedError := formaterror.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, formattedError)
		return
	}
	w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.URL.Path, balanceCreated.ID))
	responses.JSON(w, http.StatusCreated, balanceCreated)
}

