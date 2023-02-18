import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../../shared/components/FormElements/Button'
import Input from '../../shared/components/FormElements/Input'
import Card from '../../shared/components/UIElements/Card'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import './PlaceForm.css'

const UpdatePlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [loadedPlace, setLoadedPlace] = useState()
  const placeId = useParams().placeId

  const [formState, inputHandler, setFormData] = useForm({
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
  }, false)

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/places/${placeId}`)
        setLoadedPlace(responseData.place)
        setFormData({
          title: {
            value: responseData.place.title,
            isValid: true
          },
          description: {
            value: responseData.place.description,
            isValid: true
          }
      }, true)

      } catch (err) {
        console.log(err);
      }
    }
    fetchPlace()
  }, [sendRequest, placeId, setFormData])

  const placeUpdateSubmitHandler = event => {
    event.preventDefault()
    console.log(formState.inputs);
  }

  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner />
      </div>
    )
  }

  if (!loadedPlace && !error) {
    return (
      <div className='center'>
        <Card>
        <h2>Could not find place!</h2>
        </Card>
      </div>
    )
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && 
        <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
          <Input 
            id='title'
            element='input'
            type='text'
            label='Title'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid title.'
            onInput={inputHandler}
            value={loadedPlace.title}
            valid={true}
          />
          <Input 
            id='description'
            element='textarea'
            label='Description'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Please enter a valid description ( Min 5 characters ).'
            onInput={inputHandler}
            value={loadedPlace.description}
            valid={true}
          />
          <Button type='submit' disabled={!formState.isValid}>Update Place</Button>
        </form>
      }
    </>
  )
}

export default UpdatePlace