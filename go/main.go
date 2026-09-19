package main

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"log"
	"os"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

func createRandomString(n int) (string, error) {
	s := make([]byte, n)
	if _, err := rand.Read(s); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(s), nil
}

var config oauth2.Config
var userFunc func(userid string)

func Configure(app_url string, scopes []string) {
	provider, err := oidc.NewProvider(context.Background(), os.Getenv("OIDC_ISSUER"))
	if err != nil {
		log.Fatal("Provider resolution failed with error", err)
	}
	config = oauth2.Config{
		ClientID:     os.Getenv("OIDC_CLIENT_ID"),
		ClientSecret: os.Getenv("OIDC_CLIENT_SECRET"),
		Endpoint:     provider.Endpoint(),
		RedirectURL:  app_url + "/auth/v2/verify",
		Scopes:       append([]string{"oidc"}, scopes[:]...),
	}
}

func LoginHandler(c *gin.Context) {
	state := rand.Text()
	nonce := rand.Text()
	codeVerifier := oauth2.GenerateVerifier()
	session := sessions.Default(c)
	session.Set("jhid_oauth_state", state)
	session.Set("jhid_oauth_nonce", nonce)
	session.Set("jhid_oauth_code_verifier", codeVerifier)
	session.Save()
	c.Redirect(301, config.AuthCodeURL(state, oidc.Nonce(nonce), oauth2.S256ChallengeOption(codeVerifier)))
}

func CallbackHandler(c *gin.Context) {
	session := sessions.Default(c)
	state := session.Get("jhid_oauth_state")
	nonce := session.Get("jhid_oauth_nonce")
	codeVerifier := session.Get("jhid_oauth_code_verifier").(string)

	tok, err := config.Exchange(c, c.Query("code"), oauth2.VerifierOption(codeVerifier))
	if err != nil {
		log.Println("Token exchange failed with error", err)
		c.AbortWithStatus(500)
		return
	}

	idToken, ok := tok.Extra("id_token").(string)

	session.Set("jhid_auth", true)
	session.Save()
}

func EnsureLogin(redirectFail bool) func(c *gin.Context) {
	return (func(c *gin.Context) {
		session := sessions.Default(c)
		if session.Get("jhid_auth") == true {
			c.Next()
		} else {
			if redirectFail {
				c.Redirect(307, "/auth/v2/login")
				c.Abort()
				return
			} else {
				c.AbortWithStatus(401)
				return
			}
		}
	})
}
