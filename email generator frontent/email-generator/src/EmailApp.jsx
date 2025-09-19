// EmailApp.jsx
import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios'
import React, { useState } from 'react'

const EmailApp = () => {
  const [emailContent, setEmailContent] =  useState('')
  const [tone, setTone] = useState('')
  const [generatedReply, setGeneratedReply] =  useState('')
  const [loading, setLoading] =  useState(false)
  const [error, setError] =  useState('')
  const [toastOpen, setToastOpen] = useState(false)

  const handleSubmit =async ()=>{
    setLoading(true)
    setError('')
    try {
      const res = await axios.post("http://localhost:8080/api/email/generate",{
        emailContent,
        tone
      });
      setGeneratedReply(typeof res.data === "string" ? res.data: JSON.stringify(res.data))
    } catch (error) {
      setError("Failed to generate email reply. Please try again later")
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  }
  const handleCopy = async () => {
    if (generatedReply) {
      await navigator.clipboard.writeText(generatedReply)
      setToastOpen(true)  
    }
  }

  return (
    <Container>
      <Typography variant='h3' component='h1' gutterBottom>
        Email Reply Generator
      </Typography>
      <Box sx={{ mx: 3 }}>
        <TextField fullWidth multiline rows={6}
          variant='outlined'
          label="Original email content"
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }} />
        <FormControl fullWidth sx={{mb:2}}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select value={tone || ''}
           label="Tone (Optional)"
            onChange={(e)=>setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth>
          {loading?<CircularProgress size={24} />: "Generate Reply"}
        </Button>
      </Box>
      {error && <Typography color='error' sx={{mb:2}}>
        {error}
      </Typography>}
      <Box sx={{mt:3}}>
        <Typography variant='h6' gutterBottom>
          Generated Reply:
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          value={generatedReply || ''}
          inputProps={{readOnly :true}}/>
        <Button
          variant='outlined'
          sx={{ mt: 2 }}
          onClick={handleCopy}
        >
          Copy to Clipboard
        </Button>
      </Box>
      <Snackbar 
        open={toastOpen} 
        autoHideDuration={3000} 
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ zIndex: 9999 }}
      >
        <MuiAlert severity="success" onClose={() => setToastOpen(false)}>
          Copied to clipboard!
        </MuiAlert>
      </Snackbar>
    </Container>
  )
}

export default EmailApp
