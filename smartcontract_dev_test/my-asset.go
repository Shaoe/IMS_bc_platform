/*
 * SPDX-License-Identifier: Apache-2.0
 */

package main

import "time"

// MyAsset stores spectral analysis measurement data
type MyAsset struct {
	ID           string     `json:"id"`
	Added        time.Time  `json:"added"`
	Updated      time.Time  `json:"updated"`
	DFI          float64    `json:"dfi"`
	Pressure     float64    `json:"pressure"`
	Temperature  float64    `json:"temperature"`
	DTL          float64    `json:"dtl"`
	AnalysisTime float64    `json:"analysis_time"`
	Spectra      []Spectrum `json:"spectral_values"`
}

// Represents the spectral values of each spectrum
type Spectrum struct {
	X float64 `json:"y"`
	Y float64 `json:"x"`
}
