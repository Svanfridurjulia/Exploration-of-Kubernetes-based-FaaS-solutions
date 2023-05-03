package function

import (
	"strings"
	"testing"
)

func Test_getSpecial_len5(t *testing.T) {
	characterCount := 5
	want := 5
	got := len(getSpecial(characterCount))
	if want != got {
		t.Logf("Testing number of special characters generated: %d", characterCount)
		t.Errorf("Number of special characters was incorrect. Wanted: %d, but got: %d", want, got)
	}
}

func Test_getSpecial_len0(t *testing.T) {
	characterCount := 0
	want := 0
	got := len(getSpecial(characterCount))
	if want != got {
		t.Logf("Testing number of special characters generated: %d", characterCount)
		t.Errorf("Number of special characters was incorrect. Wanted: %d, but got: %d", want, got)
	}
}

func Test_getSpecial_allCharsSpecialLen6(t *testing.T) {
	specialCharSet := "!@#$%&*?"
	characterCount := 6
	got := getSpecial(characterCount)
	specialCount := 0
	for _, ch := range got {
		if strings.Contains(specialCharSet, string(ch)) {
			specialCount++
		}
	}
	if len(got) != specialCount {
		t.Logf("Testing if all characters generated are special characters")
		t.Errorf("At least one character not special, got: %s", got)
	}
}

func Test_getDigits_len5(t *testing.T) {
	characterCount := 5
	want := 5
	got := len(getDigits(characterCount))
	if want != got {
		t.Logf("Testing number of special characters generated: %d", characterCount)
		t.Errorf("Number of special characters was incorrect. Wanted: %d, but got: %d", want, got)
	}
}

func Test_getDigits_len0(t *testing.T) {
	characterCount := 0
	want := 0
	got := len(getDigits(characterCount))
	if want != got {
		t.Logf("Testing number of special characters generated: %d", characterCount)
		t.Errorf("Number of special characters was incorrect. Wanted: %d, but got: %d", want, got)
	}
}

func Test_getDigits_allCharsDigitsLen6(t *testing.T) {
	digitsSet := "0123456789"
	characterCount := 6
	got := getDigits(characterCount)
	digitCount := 0
	for _, ch := range got {
		if strings.Contains(digitsSet, string(ch)) {
			digitCount++
		}
	}
	if len(got) != digitCount {
		t.Logf("Testing if all characters generated are digits")
		t.Errorf("At least one character not a digit, got: %s", got)
	}
}

func Test_getChar_len5(t *testing.T) {
	characterCount := 5
	want := 5
	got := len(getChar(characterCount))
	if want != got {
		t.Logf("Testing number of letters generated: %d", characterCount)
		t.Errorf("Number of letters was incorrect. Wanted: %d, but got: %d", want, got)
	}
}

func Test_getChar_len0(t *testing.T) {
	characterCount := 0
	want := 0
	got := len(getChar(characterCount))
	if want != got {
		t.Logf("Testing number of letters generated: %d", characterCount)
		t.Errorf("Number of letters was incorrect. Wanted: %d, but got: %d", want, got)
	}
}

func Test_getChar_allCharsDigitsLen6(t *testing.T) {
	lettersSet := "abcdedfghijklmnopqrstABCDEFGHIJKLMNOPQRSTUVWXYZ"
	characterCount := 6
	got := getChar(characterCount)
	digitCount := 0
	for _, ch := range got {
		if strings.Contains(lettersSet, string(ch)) {
			digitCount++
		}
	}
	if len(got) != digitCount {
		t.Logf("Testing if all characters generated are letters")
		t.Errorf("At least one character not a letter, got: %s", got)
	}
}

func Test_generatePassword_returnsPasswordLen16(t *testing.T) {
	want := 16
	got := len(generatePassword())
	if want != got {
		t.Logf("Testing that password generated is of length: %d", want)
		t.Errorf("Password length was incorrect. Wanted: %d, but got: %d", want, got)
	}
}

func Test_generatePassword_allCharsLegal(t *testing.T) {
	charSet := "!@#$%&*?0123456789abcdedfghijklmnopqrstABCDEFGHIJKLMNOPQRSTUVWXYZ"
	got := generatePassword()
	charCount := 0
	for _, ch := range got {
		if strings.Contains(charSet, string(ch)) {
			charCount++
		}
	}
	if len(got) != charCount {
		t.Logf("Testing if all characters generated are letters")
		t.Errorf("At least one character not a letter, got: %s", got)
	}
}