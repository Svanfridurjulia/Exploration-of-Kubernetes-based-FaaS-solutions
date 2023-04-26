package function

import (
	"io"
	"net/http"
	"net/smtp"
)

func SendMail(user string) {
	from := "fabulservice@gmail.com"
	password := "<passwordgoeshere>"

	to := []string{from}

	host := "smtp.gmail.com"
	port := "587"
	address := host + ":" + port

	subject := "Subject: New user registered\n"
	body := "Hello!\nThis email was sent to you to inform you that a new user has registered with Fabulous as a Service.\nThe username is: " + user + "\n\t\n Best regards,\n Fabulous as a Service"
	message := []byte(subject + body)

	auth := smtp.PlainAuth("", from, password, host)

	err := smtp.SendMail(address, auth, from, to, message)
	if err != nil {
		panic(err)
	}
}

func Handle(w http.ResponseWriter, r *http.Request) {
	var input []byte

	if r.Body != nil {
		defer r.Body.Close()

		body, _ := io.ReadAll(r.Body)

		input = body
	}

	SendMail(string(input))

}
