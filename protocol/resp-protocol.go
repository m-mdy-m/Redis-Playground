package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"strings"
)

const (
	sourcePath = "ip.source.txt"
	targetPath = "ips.txt"
)

// IP represents a single IP address with validation capabilities
type IP struct {
	address string
}

// NewIP creates a new IP object and validates the address format
func NewIP(address string) (*IP, error) {
	// Use a library like net.ParseIP for robust validation
	// Replace with your preferred validation logic
	if !strings.Contains(address, ".") && !strings.Contains(address, ":") {
		return nil, fmt.Errorf("invalid IP format: %s", address)
	}
	return &IP{address: address}, nil
}

// generateResp takes a slice of validated IPs and writes them to a file in RESP format
func generateResp(ips []*IP, targetFile *os.File) error {
	for _, ip := range ips {
		n, err := fmt.Fprintf(targetFile, "*3\r\n$3\r\nSET\r\n%d\r\n%s\r\n$1\r\n1\r\n", len(ip.address), ip.address)
		if err != nil {
			return err
		}
		if n != 36 {
			return fmt.Errorf("unexpected number of bytes written: %d", n)
		}
	}
	return nil
}

func main() {
	// Open source file for reading
	sourceFile, err := os.Open(sourcePath)
	if err != nil {
		fmt.Println("Error opening source file:", err)
		return
	}
	defer sourceFile.Close()

	// Read file content
	data, err := ioutil.ReadAll(sourceFile)
	if err != nil {
		fmt.Println("Error reading source file:", err)
		return
	}

	// Split data into lines and validate each IP
	var validIPs []*IP
	for _, line := range strings.Split(string(data), "\n") {
		ip, err := NewIP(line)
		if err != nil {
			fmt.Printf("Warning: Ignoring invalid IP: %s (%s)\n", line, err)
			continue
		}
		validIPs = append(validIPs, ip)
	}

	// Open target file for writing
	targetFile, err := os.Create(targetPath)
	if err != nil {
		fmt.Println("Error creating target file:", err)
		return
	}
	defer targetFile.Close()

	// Generate and write RESP data
	err = generateResp(validIPs, targetFile)
	if err != nil {
		fmt.Println("Error generating RESP:", err)
		return
	}

	fmt.Println("RESP data written successfully!")
}
