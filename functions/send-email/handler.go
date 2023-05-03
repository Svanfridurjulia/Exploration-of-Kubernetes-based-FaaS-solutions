package function

import (
	"context"
	"encoding/json"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager"
	"log"
	"net/http"
	"net/smtp"
)

type Secret struct {
	Password string `json:"password"`
}

// getSecrets returns a string
// The string contains the password to the sender email, gotten from AWS secrets
func getSecrets() string {
	secretName := "email-pass"
	region := "eu-west-1"

	config, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(region))
	if err != nil {
		log.Println(err)
		log.Println("Error when loading default config")
	}

	// Create Secrets Manager client
	svc := secretsmanager.NewFromConfig(config)

	input := &secretsmanager.GetSecretValueInput{
		SecretId:     aws.String(secretName),
		VersionStage: aws.String("AWSCURRENT"), // VersionStage defaults to AWSCURRENT if unspecified
	}

	// Get the secret value
	result, err := svc.GetSecretValue(context.TODO(), input)
	if err != nil {
		log.Println(err)
		log.Println("Error when getting secret value")

	}

	// Decrypts secret using the associated KMS key.
	var secret Secret
	err = json.Unmarshal([]byte(*result.SecretString), &secret)
	if err != nil {
		log.Println(err)
		log.Println("Error when unmarshalling")
	}
	var password string = secret.Password
	return password

}

// sendMail sends and email to fabuloussaservice@gmail.com
// An error is logged if something goes wrong
func sendMail(emailPassword string) {
	// Define the sender email, password of the sender email and the receiver email
	from := "fabuloussaservice@gmail.com"
	password := emailPassword
	to := []string{from}

	host := "smtp.gmail.com"
	port := "587"
	address := host + ":" + port

	// Write subject and body of the email
	subject := "Subject: New user registered\n"
	body := "Hello!\nThis email was sent to you to inform you that a new user has registered with Fabulous as a Service.\nThe username is: test \n\t\n Best regards,\n Fabulous as a Service"
	message := []byte(subject + body)

	auth := smtp.PlainAuth("", from, password, host)

	// Try to send the mail
	err := smtp.SendMail(address, auth, from, to, message)
	if err != nil {
		log.Println(err)
		log.Println("Error when sending mail")
	}
}

// Handle receives a http request
func Handle(w http.ResponseWriter, r *http.Request) {

	password := getSecrets()
	sendMail(password)

}
