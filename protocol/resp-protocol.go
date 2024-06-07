package main

import (
	"bufio"
	"io/ioutil"
	"bytes"
	"fmt"
	"os"
	"strings"
)

const (
	sourcePath = "ip.source.txt"
	setCommand = "*3\r\n$3\r\nSET\r\n$"
)

func generateResp(ips []string) {
	for _, ip := range ips {
		trimmedIP := strings.TrimSpace(ip)
		command := fmt.Sprintf("%s%d\r\n%s\r\n$1\r\n1\r\n", setCommand, len(trimmedIP), trimmedIP)
		fmt.Print(command)
	}
}
func main() {
	data, err := ioutil.ReadFile(sourcePath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading file: %v\n", err)
		return
	}

	scanner := bufio.NewScanner(bytes.NewReader(data))
	scanner.Split(bufio.ScanLines)

	var ips []string
	for scanner.Scan() {
		ips = append(ips, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "Error reading file: %v\n", err)
		return
	}

	generateResp(ips)
}
