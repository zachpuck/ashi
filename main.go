package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"io"
	"io/ioutil"
	"log"
	"net/http"

	lex "github.com/aws/aws-sdk-go/service/lexruntimeservice"
)

// LexProcessor has all the information for connecting with Lex
type LexProcessor struct {
	projectID string
	accessKeyID string
	secretAccessKey string
	lang string
	timeZone string
	svc *lex.LexRuntimeService
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
	lx.accessKeyID = a[1]
	lx.secretAccessKey = a[2]
	lx.lang = a[3]
	lx.timeZone = a[4]

	// Auth process: https://docs.aws.amazon.com/sdk-for-go/api/service/lexruntimeservice/#New

	lx.ctx = context.Background()
	sess, err := session.NewSession(&aws.Config{
		Credentials: credentials.NewStaticCredentials(lx.accessKeyID, lx.secretAccessKey, ""),
	})
	if err != nil {
		log.Fatal("Error in session creation: ", err)
	}
	lx.svc = lex.New(sess)

	return
}

func (lx *LexProcessor) processNLP(rawMessage string, username string) (r NLPResponse) {


	input := []byte("What day is it?")

	bytes.NewReader(input)

	output, err := lx.svc.PostContent(&lex.PostContentInput{
		//Accept:            aws.String("text/plain; charset=utf-8"),
		BotAlias:          aws.String("ashibot"),
		BotName:           aws.String("ashi"),
		ContentType:       aws.String("text/plain; charset=utf-8"),
		InputStream:       bytes.NewReader(input),
		//RequestAttributes: nil,
		//SessionAttributes: nil,
		UserId:            aws.String(username),
	})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(output.Message)

	r = NLPResponse{
		Intent:     aws.StringValue(output.IntentName),
		Confidence: 0,
		Entities:   nil,
	}
	return r
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