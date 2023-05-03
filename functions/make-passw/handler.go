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

// getSpecial returns a string
// The returned string is of length count and contains a random assortment of special characters
func getSpecial(count int) string {
	tokens := ""
	for i := 0; i < count; i++ {
		index := rand.Intn(len(specialCharSet))
		tokens = tokens + string(specialCharSet[index])
	}
	return tokens
}

// getDigits returns a string
// The returned string is of length count and contains a random assortment of digits
func getDigits(count int) string {
	tokens := ""
	for i := 0; i < count; i++ {
		index := rand.Intn(len(digitsSet))
		tokens = tokens + string(digitsSet[index])
	}
	return tokens
}

// getChar returns a string
// The returned string is of length count and contains a random assortment of lowercase and uppercase characters
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

// generatePassword returns a string
// The returned string is of length 16 and is a random password made from special characters, digits and lettere
func generatePassword() string {
	rand.Seed(time.Now().UnixNano())
	passwordLength := 16
	// The password should not only contain digits and special characters
	randomDigits := rand.Intn((passwordLength / 2) - 1)
	randomSpecial := rand.Intn((passwordLength / 2) - 1)
	// Get the special characters and digits that will go into the password
	special := getSpecial(randomSpecial)
	digits := getDigits(randomDigits)
	// Get the rest of the characters for the password in letters
	characters := getChar(passwordLength - randomDigits - randomSpecial)
	password := special + digits + characters

	// Shuffle the string of characters twice to get a more unique password
	inRune := []rune(password)
	rand.Shuffle(len(inRune), func(i, j int) {
		inRune[i], inRune[j] = inRune[j], inRune[i]
	})
	// Get a new seed
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(inRune), func(i, j int) {
		inRune[i], inRune[j] = inRune[j], inRune[i]
	})

	return string(inRune)
}

// Handle receives a http request and writes back a generated password
func Handle(w http.ResponseWriter, r *http.Request) {

	defer r.Body.Close()

	password := generatePassword()

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Your password is : %s", password)))
}
