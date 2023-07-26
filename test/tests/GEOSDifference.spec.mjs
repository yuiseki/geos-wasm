// Import tape for testing
import test from 'tape'

// Import the geos module
import initGeosJs from '../../build/package/geos.esm.js'
const geos = await initGeosJs()

// Define some WKT strings to use as inputs
const wkt1 = 'POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))'
const wkt2 = 'POLYGON ((0.5 0.5, 1.5 0.5, 1.5 1.5, 0.5 1.5, 0.5 0.5))'

// Define the expected output WKT string
const expected = 'POLYGON ((1 0, 0 0, 0 1, 0 1, 0 0, 1 0, 1 0))'

// Create a reader and a writer for WKT conversion
const reader = geos.GEOSWKTReader_create()
const writer = geos.GEOSWKTWriter_create()
// Set the writer to output 0 decimal places
geos.GEOSWKTWriter_setRoundingPrecision(writer, 0)
// Convert the input WKT strings to GEOS geometries
const geomPtr1 = geos.GEOSWKTReader_read(reader, wkt1)
const geomPtr2 = geos.GEOSWKTReader_read(reader, wkt2)

// Perform the difference operation
const diffPtr = geos.GEOSDifference(geomPtr1, geomPtr2)

// Convert the difference geometry to a WKT string
const result = geos.GEOSWKTWriter_write(writer, diffPtr)

// Test if the result matches the expected output
test('GEOSDifference', function (t) {
  t.plan(1)
  t.equal(result, expected)
})

// Free the memory allocated for the geometries
geos.GEOSGeom_destroy(geomPtr1)
geos.GEOSGeom_destroy(geomPtr2)
geos.GEOSGeom_destroy(diffPtr)

// Destroy the reader and writer
geos.GEOSWKTReader_destroy(reader)
geos.GEOSWKTWriter_destroy(writer)
