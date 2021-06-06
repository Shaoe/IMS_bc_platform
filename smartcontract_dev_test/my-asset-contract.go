/*
 * SPDX-License-Identifier: Apache-2.0
 */

package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// MyAssetContract contract for managing CRUD for MyAsset
type MyAssetContract struct {
	contractapi.Contract
}

// MyAssetExists returns true when asset with given ID exists in world state
func (c *MyAssetContract) MyAssetExists(ctx contractapi.TransactionContextInterface, myAssetID string) (bool, error) {
	data, err := ctx.GetStub().GetState(myAssetID)

	if err != nil {
		return false, err
	}

	return data != nil, nil
}

// CreateMyAsset creates a new instance of MyAsset
func (c *MyAssetContract) CreateMyAsset(ctx contractapi.TransactionContextInterface, myAssetID string, myAsset MyAsset) error {
	exists, err := c.MyAssetExists(ctx, myAssetID)
	if err != nil {
		return fmt.Errorf("could not read from world state. %s", err)
	} else if exists {
		return fmt.Errorf("the asset %s already exists", myAssetID)
	}

	bytes, _ := json.Marshal(myAsset)

	return ctx.GetStub().PutState(myAssetID, bytes)
}

// ReadMyAsset retrieves an instance of MyAsset from the world state
func (c *MyAssetContract) ReadMyAsset(ctx contractapi.TransactionContextInterface, myAssetID string) (*MyAsset, error) {
	exists, err := c.MyAssetExists(ctx, myAssetID)
	if err != nil {
		return nil, fmt.Errorf("could not read from world state. %s", err)
	} else if !exists {
		return nil, fmt.Errorf("the asset %s does not exist", myAssetID)
	}

	bytes, _ := ctx.GetStub().GetState(myAssetID)

	myAsset := new(MyAsset)

	err = json.Unmarshal(bytes, myAsset)

	if err != nil {
		return nil, fmt.Errorf("could not unmarshal world state data to type MyAsset")
	}

	return myAsset, nil
}

// UpdateMyAsset retrieves an instance of MyAsset from the world state and updates its value
func (c *MyAssetContract) UpdateMyAsset(ctx contractapi.TransactionContextInterface, myAssetID string, newAsset MyAsset) error {
	exists, err := c.MyAssetExists(ctx, myAssetID)
	if err != nil {
		return fmt.Errorf("could not read from world state. %s", err)
	} else if !exists {
		return fmt.Errorf("the asset %s does not exist", myAssetID)
	}

	bytes, _ := json.Marshal(newAsset)

	return ctx.GetStub().PutState(myAssetID, bytes)
}

// DeleteMyAsset deletes an instance of MyAsset from the world state
func (c *MyAssetContract) DeleteMyAsset(ctx contractapi.TransactionContextInterface, myAssetID string) error {
	exists, err := c.MyAssetExists(ctx, myAssetID)
	if err != nil {
		return fmt.Errorf("could not read from world state %s", err)
	} else if !exists {
		return fmt.Errorf("the asset %s does not exist", myAssetID)
	}

	return ctx.GetStub().DelState(myAssetID)
}

// DeleteAllAssets deletes all instances of MyAsset from the world state
func (c *MyAssetContract) DeleteAllAssets(ctx contractapi.TransactionContextInterface) error {

	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return err
	}
	defer resultsIterator.Close()

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return err
		}

		var myAsset MyAsset
		err = json.Unmarshal(queryResponse.Value, &myAsset)
		if err != nil {
			return fmt.Errorf("could not unmarshal world state data to type MyAsset")
		}
		ctx.GetStub().DelState(myAsset.ID)

	}

	return nil
}

// QuerryAllAssets retrieves all instances of MyAsset from the world state
func (c *MyAssetContract) QuerryAllAssets(ctx contractapi.TransactionContextInterface) ([]*MyAsset, error) {

	results, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer results.Close()

	var myAssets []*MyAsset
	for results.HasNext() {
		queryResponse, err := results.Next()
		if err != nil {
			return nil, err
		}

		var myAsset MyAsset
		err = json.Unmarshal(queryResponse.Value, &myAsset)
		if err != nil {
			return nil, err
		}
		myAssets = append(myAssets, &myAsset)
	}

	return myAssets, nil
}

// QuerryChangedAssets retrieves all new or updated instances of MyAsset from the world state since date
func (c *MyAssetContract) QuerryChangedAssets(ctx contractapi.TransactionContextInterface, lastUpdate time.Time) ([]*MyAsset, error) {

	// Get all the assets from the ledger
	results, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer results.Close()

	var myAssets []*MyAsset
	// Loop through each asset
	for results.HasNext() {
		// Get next asset
		queryResponse, err := results.Next()
		if err != nil {
			return nil, err
		}

		var myAsset MyAsset
		// Deserialize the asset json
		err = json.Unmarshal(queryResponse.Value, &myAsset)
		if err != nil {
			return nil, fmt.Errorf("could not unmarshal world state data to type MyAsset")
		}

		// Only append assets that were changed or added after the lastUpdate date
		if myAsset.Updated.After(lastUpdate) {
			myAssets = append(myAssets, &myAsset)
		}

	}

	return myAssets, nil
}
