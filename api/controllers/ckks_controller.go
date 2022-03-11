package controllers

import (
	"encoding/json"
	"finalthesisproject/api/models"
	"finalthesisproject/api/responses"
	"io/ioutil"
	"net/http"
)

func (server *Server) CountQT(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	opsFloat1 := models.OpsFloat1{}
	err = json.Unmarshal(body, &opsFloat1)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	//w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.URL.Path, post.Constant))
	responses.JSON(w, http.StatusCreated, opsFloat1)
}
