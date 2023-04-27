// Disclaimer: This function is not meant to show the right way to generate passwords, it is written to show a working Go function with OpenFaaS

package function

import (
	"fmt"
	"math/rand"
	"net/http"
	"time"
)

var (
	lowerCharSet   = "abcdedfghijklmnopqrst"
	upperCharSet   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	specialCharSet = "!@#$%&*?"
	digitsSet      = "0123456789"
)

func getSpecial(count int) string {
	tokens := ""
	for i := 0; i < count; i++ {
		index := rand.Intn(len(specialCharSet))
		tokens = tokens + string(specialCharSet[index])
	}
	return tokens
}

func getDigits(count int) string {
	tokens := ""
	for i := 0; i < count; i++ {
		index := rand.Intn(len(digitsSet))
		tokens = tokens + string(digitsSet[index])
	}
	return tokens
}

func getChar(count int) string {
	tokens := ""
	for i := 0; i < count; i++ {
		lowerOrUpper := rand.Intn(2)
		if lowerOrUpper == 1 {
			index := rand.Intn(len(lowerCharSet))
			tokens = tokens + string(lowerCharSet[index])
		} else {
			index := rand.Intn(len(upperCharSet))
			tokens = tokens + string(upperCharSet[index])
		}
	}
	return tokens
}

func generatePassword() string {
	rand.Seed(time.Now().UnixNano())
	PasswordLength := 16
	RandomDigits := rand.Intn((PasswordLength / 2) - 1)
	RandomSpecial := rand.Intn((PasswordLength / 2) - 1)
	special := getSpecial(RandomSpecial)
	digits := getDigits(RandomDigits)
	rand.Seed(time.Now().UnixNano())
	characters := getChar(PasswordLength - RandomDigits - RandomSpecial)
	password := special + digits + characters

	inRune := []rune(password)
	rand.Shuffle(len(inRune), func(i, j int) {
		inRune[i], inRune[j] = inRune[j], inRune[i]
	})
	rand.Shuffle(len(inRune), func(i, j int) {
		inRune[i], inRune[j] = inRune[j], inRune[i]
	})

	return string(inRune)
}

func Handle(w http.ResponseWriter, r *http.Request) {

	defer r.Body.Close()

	password := generatePassword()

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Your password is : %s", password)))
}
