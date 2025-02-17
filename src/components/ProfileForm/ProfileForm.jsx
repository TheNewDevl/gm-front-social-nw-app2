import { useState, useEffect } from 'react'
import {
  Avatar,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Stack,
} from '@mui/material'
import { useContext } from 'react'
import { AlertContext } from '../../utils/context/AlertContext'
import { UserContext } from '../../utils/context/UserContext'
import Loader from '../../components/Loader/Loader'
import { PhotoCamera } from '@mui/icons-material'
import { useTheme } from '@mui/material'
import { AuthInterceptors } from '../../interceptors/AuthInterceptors'
import { profileValidation } from '../../utils/validators'
import { RequestsContext } from '../../utils/context/RequestsContext'
import useSecureAxios from '../../utils/hooks/useSecureAxios'

function ProfileForm({ method }) {
  const theme = useTheme()
  const [profileInputs, setprofileInputs] = useState({
    firstName: '',
    lastName: '',
    bio: '',
  })
  const [file, setFile] = useState({
    file: '',
    urlForPreview: null,
  })
  const [error, setError] = useState()
  const [formErrors, setFormErrors] = useState(null)
  const { user } = useContext(UserContext)
  const { setAlertStates } = useContext(AlertContext)
  const [profileId, setProfileId] = useState('')
  const uri = method === 'POST' ? 'profile' : `profile/${profileId}`

  const { useGetData } = useContext(RequestsContext)
  const secureAxios = useSecureAxios()

  //if the profile has already been created, the fields are pre-filled with the profile data
  const { data, isLoading } = useGetData(`profile/${user.user.id}`)
  useEffect(() => {
    if (data) {
      setprofileInputs({
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
      })
      setProfileId(data.id)
    }
  }, [data])

  //set input values to credentials state
  const handleValues = (e) => {
    setprofileInputs({
      ...profileInputs,
      [e.target.name]: e.target.value,
    })
  }

  //delete uploaded file
  const handleDete = () => {
    setFile({
      file: '',
      urlForPreview: null,
    })
  }
  const handleFile = (e) => {
    setFile({
      file: e.target.files[0],
      //for preview img
      urlForPreview: URL.createObjectURL(e.target.files[0]),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validate imputs
    const errors = profileValidation(profileInputs)
    setFormErrors(errors)

    if (Object.keys(errors).length === 0) {
      const data = new FormData()
      //append file only if file exists (back requirement)
      file.file && data.append('file', file.file)
      data.append('firstName', profileInputs.firstName)
      data.append('lastName', profileInputs.lastName)
      data.append('bio', profileInputs.bio)

      try {
        method === 'POST'
          ? await secureAxios.post(uri, data)
          : await secureAxios.patch(uri, data)
        setAlertStates({
          open: true,
          type: 'success',
          message: 'Modifications enregistrées !',
        })
      } catch (err) {
        if (err?.response?.data?.message) {
          setError(err.response.data.message)
        } else if (err?.request) {
          setError('Pas de réponse du serveur')
        } else {
          setError(err.message)
        }
      }
    }
  }

  //catch request errors and use it
  useEffect(() => {
    if (error) {
      setAlertStates({ open: true, type: 'error', message: `${error}` })
    }
  }, [error])

  return (
    <>
      <AuthInterceptors />
      {isLoading ? (
        <Loader style={{ marginTop: '5em' }} />
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          {data || file.urlForPreview ? (
            <Avatar
              sx={{ width: 150, height: 150, margin: '1em auto' }}
              src={file.urlForPreview ? file.urlForPreview : data.photo}
              alt="Photo de profil"
            />
          ) : null}
          {/* firstName */}
          <Stack direction="row" columnGap="2em" justifyContent="space-between">
            <Stack width="100%">
              <TextField
                fullWidth
                variant="standard"
                margin="normal"
                required
                autoFocus
                label="Prénom"
                name="firstName"
                type="text"
                value={profileInputs.firstName}
                onChange={handleValues}
                error={formErrors?.firstName ? true : false}
              />
              <Typography component="span" variant="body2" color="error.light">
                {formErrors?.firstName}
              </Typography>
            </Stack>

            {/* lastName */}

            <Stack width="100%">
              <TextField
                fullWidth
                variant="standard"
                margin="normal"
                required
                label="Nom"
                name="lastName"
                type="text"
                value={profileInputs.lastName}
                onChange={handleValues}
                error={formErrors?.lastName ? true : false}
              />
              <Typography component="span" variant="body2" color="error.light">
                {formErrors?.lastName}
              </Typography>
            </Stack>
          </Stack>

          <br />
          {/* BIO */}
          <TextField
            id="standard-multiline-static"
            label={`Quelques mots à propos de vous `}
            name="bio"
            required
            fullWidth
            minRows={3}
            multiline
            variant="outlined"
            value={profileInputs.bio}
            onChange={handleValues}
            error={formErrors?.bio ? true : false}
          />

          <Typography component="span" variant="body2" color="error.light">
            {formErrors?.bio}
          </Typography>

          {/* Avatar */}
          {/* Api errors */}
          {error && (
            <Typography component="span" variant="body1" color="error.light">
              {error}
            </Typography>
          )}
          <Stack
            mt="2em"
            justifyContent="center"
            flexWrap="wrap"
            gap={1}
            sx={{
              width: '100%',
              [theme.breakpoints.up('sm')]: { flexDirection: 'row' },
            }}
          >
            <label htmlFor="file">
              <input
                id="file"
                accept="image/*"
                type="file"
                name="file"
                onChange={handleFile}
                hidden
              />
              <Button
                fullWidth
                component="span"
                sx={{
                  [theme.breakpoints.up('sm')]: { width: '180px' },
                }}
                variant="outlined"
              >
                Avatar
                <PhotoCamera sx={{ ml: '1em' }} />
              </Button>
            </label>

            {file.urlForPreview && (
              <Button
                sx={{
                  [theme.breakpoints.up('sm')]: { width: '180px' },
                }}
                variant="outlined"
                color="error"
                onClick={handleDete}
              >
                Supprimer <PhotoCamera sx={{ ml: '1em' }} />
              </Button>
            )}
            <Button
              sx={{
                [theme.breakpoints.up('sm')]: { width: '180px' },
              }}
              type="submit"
              variant="contained"
              disabled={isLoading ? true : false}
            >
              {isLoading ? <CircularProgress size={'1.7em'} /> : 'Sauvegarder'}
            </Button>
          </Stack>
        </Box>
      )}
    </>
  )
}

export default ProfileForm
