package function

import (
	"context"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager"
	"net/http"
	"net/smtp"
)

func GetSecrets() string {
	secretName := "email-password"
	region := "eu-west-1"

	config, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(region))
	if err != nil {
		panic(err)
	}

	// Create Secrets Manager client
	svc := secretsmanager.NewFromConfig(config)

	input := &secretsmanager.GetSecretValueInput{
		SecretId:     aws.String(secretName),
		VersionStage: aws.String("AWSCURRENT"), // VersionStage defaults to AWSCURRENT if unspecified
	}

	result, err := svc.GetSecretValue(context.TODO(), input)
	if err != nil {
		panic(err)
	}

	// Decrypts secret using the associated KMS key.
	var secretString string = *result.SecretString
	return secretString

}

func SendMail(emailPassword string) {

	from := "fabulservice@gmail.com"
	password := emailPassword

	to := []string{from}

	host := "smtp.gmail.com"
	port := "587"
	address := host + ":" + port

	subject := "Subject: New user registered\n"
	body := "Hello!\nThis email was sent to you to inform you that a new user has registered with Fabulous as a Service.\nThe username is: test \n\t\n Best regards,\n Fabulous as a Service"
	message := []byte(subject + body)

	auth := smtp.PlainAuth("", from, password, host)

	err := smtp.SendMail(address, auth, from, to, message)
	if err != nil {
		panic(err)
	}
}

func Handle(w http.ResponseWriter, r *http.Request) {

	password := GetSecrets()
	SendMail(password)

}
