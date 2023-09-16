// Specify the code runs on the client in order to support the interactive functionality
'use client'

// Import needed library components
import React from 'react'
import { z } from 'zod'
import isNumeric from 'validator/lib/isNumeric'
import {
  Button,
  TextField,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material'

// Define a valid input schema for the form
// The name corresponds with the input name
const schema = z.object({
  number1: z
    .string()
    .refine((it) => isNumeric(it), { message: 'Number 1 must be numeric' }),
  number2: z
    .string()
    .refine((it) => isNumeric(it), { message: 'Number 2 must be numeric' }),
  greeting: z.string(),
  boolean1: z.string(),
})

// Define input type of the schema to be used as parameter
type Input = z.infer<typeof schema>

/**
 * Main function that returns TSX syntax of dynamic HTML page
 * Everything returned from this function will be rendered in the page
 */
export default function Home() {
  const [state, setState] = React.useState({
    number1: '41',
    number2: '124',
    greeting: 'Hello world!',
    boolean1: 'false',
  })

  function handleChange(e: any) {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  /**
   * Main function to handle the input conversion to the desired output
   */
  async function onClick() {
    // Get the input values
    try {
      const input: Input = schema.parse(state)
      const content: string = mapToResultContent(input)
      downloadAsTxt(content)
    } catch (e: any) {
      alert(e.message)
    }
  }

  // Return actual UI components
  return (
    <Box sx={{ width: '100%', marginLeft: '10%', paddingTop: '5%' }}>
      <Typography variant="h1" justifyContent={'center'} gutterBottom>
        Convert APP
      </Typography>
      <Typography variant={'body1'} gutterBottom>
        Fill up the fields and download the configuration
      </Typography>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch', marginTop: '5%' },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            required
            id="number1"
            label="Number 1"
            variant="outlined"
            name="number1"
            value={state.number1}
            onChange={handleChange}
          />
          <TextField
            id="number2"
            label="Number 2"
            variant="outlined"
            name="number2"
            value={state.number2}
            onChange={handleChange}
          />
          <TextField
            required
            id="greeting"
            label="Greeting"
            variant="outlined"
            name="greeting"
            value={state.greeting}
            onChange={handleChange}
          />
        </div>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                name={'boolean1'}
                value={state.boolean1}
                onChange={handleChange}
              />
            }
            label="Label"
          />
        </FormGroup>
        <div>
          <Button
            name="convert"
            variant={'outlined'}
            onClick={onClick}
            sx={{ marginTop: '5%' }}
          >
            Download configurations
          </Button>
        </div>
      </Box>
    </Box>
  )
}

// Helper functions

function mapToResultContent(input: Input): string {
  return `${input.number1} + ${input.number2} = ${
    parseFloat(input.number1) + parseFloat(input.number2)
  }\n${input.greeting}${
    input.boolean1 ? '\n\nLabel is selected' : '\nLabel was not selected'
  }`
}

function downloadAsTxt(content: string): void {
  // Create a Blob containing the file content
  const blob: Blob = new Blob([content], { type: 'text/plain' })

  // Create a URL for the Blob
  const url: string = URL.createObjectURL(blob)

  // Create an anchor element for downloading
  const downloadLinkElement: HTMLAnchorElement = document.createElement('a')
  downloadLinkElement.href = url
  downloadLinkElement.download = 'configuration.txt'

  // Trigger a click event to download the file
  downloadLinkElement.click()

  // Clean up by revoking the URL
  URL.revokeObjectURL(url)
}
