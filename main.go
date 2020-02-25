package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"io/ioutil"
	"net/http"

	lex "github.com/aws/aws-sdk-go/service/lexruntimeservice"
)

// LexProcessor has all the information for connecting with Lex
type LexProcessor struct {
	projectID string
	authJSONFilePath string
	lang string
	timeZone string
	sessionClient *lex.LexRuntimeService
	ctx context.Context
}

// NLPResponse is the struct for the response
type NLPResponse struct {
	Intent string `json:"intent"`
	Confidence float32 `json:"confidence"`
	Entities map[string]string `json:"entities"`
}

var lx LexProcessor

func (lx *LexProcessor) init(a ...string) (err error) {
	lx.projectID = a[0]
	lx.authJSONFilePath = a[1]
	lx.lang = a[2]
	lx.timeZone = a[3]

	// Auth process: https://docs.aws.amazon.com/sdk-for-go/api/service/lexruntimeservice/#New

	lx.ctx = context.Background()
	cfg := &aws.Config{}
	sessionClient := lex.New(cfg)

	return
}

func main() {
	http.HandleFunc("/", requestHandler)
	fmt.Println("Started Listening...")
	http.ListenAndServe(":5000", nil)
}

func requestHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		// POST method, receives a json to parse
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body",
				http.StatusInternalServerError)
		}
		type inboundMessage struct {
			Message string
		}
		var m inboundMessage
		err = json.Unmarshal(body, &m)
		if err != nil {
			panic(err)
		}

		fmt.Println(m.Message)
	}
}