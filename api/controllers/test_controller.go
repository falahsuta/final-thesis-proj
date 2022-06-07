package controllers

import (
	"encoding/json"
	"finalthesisproject/api/models"
	"finalthesisproject/api/responses"
	"io/ioutil"
	"net/http"
)

func (server *Server) SpesificAverageTest(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	test := models.Test{}
	err = json.Unmarshal(body, &test)

	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	averageTest, err := test.FindAverageSpesificTest(server.DB)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	responses.JSON(w, http.StatusOK, averageTest)
}
