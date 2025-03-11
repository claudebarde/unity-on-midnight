#!/bin/bash

# Create build directories for contracts
mkdir -p build/contracts/amm
mkdir -p build/contracts/kyc
mkdir -p build/contracts/did

# Set path to compactc binary
COMPACTC="/Users/davidrutledge/Desktop/compactc-macos-3/compactc"

# Check if compactc exists
if [ ! -f "$COMPACTC" ]; then
    echo "Error: compactc not found at $COMPACTC"
    exit 1
fi

# Compile contracts
echo "Compiling contracts..."
$COMPACTC src/blockchain/contracts/amm_interface.compact build/contracts/amm
$COMPACTC src/blockchain/contracts/kyc_verification.compact build/contracts/kyc
$COMPACTC src/blockchain/contracts/did_registry.compact build/contracts/did

echo "Compilation complete. Artifacts stored in build/contracts/"
