import React, { useState } from 'react'
import Button from '../../shared/components/FormElements/Button'
import Input from '../../shared/components/FormElements/Input'
import Card from '../../shared/components/UIElements/Card'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'

import { useForm } from '../../shared/hooks/form-hook'

import './Auth.css'

const Auth = () => {
const [isLoginMode, setIsLoginMode] = useState(true)

  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: '',
      isValid: false,
    },
    password: {
      value: '',
      isValid: false,
    }
  }, 
  false
  )

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData({
        ...formState.inputs,
        name: undefined
      }, formState.inputs.email.isValid && formState.inputs.password.isValid)
    } else {
      setFormData({
        ...formState.inputs,
        name: {
          value: '',
          isValid: false
        }
      }, false)
    }
    setIsLoginMode(prevMode => !prevMode)
  }

  const authSubmitHandler = event => {
    event.preventDefault()
    console.log(formState.inputs); // log inputs because there is no backend yet
  }

  return (
    <Card className='authentication'>  
      <h2>
        {isLoginMode ? 
          "Log In": 
          "Sign Up"
        }
      </h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode && (
          <Input
            element='input'
            id='name'
            type='text'
            label='Your Name'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid name.'
            onInput={inputHandler}
          />
          )}
        <Input
          element='input' 
          id='email'
          type='email'
          label='Email' 
          validators={[VALIDATOR_EMAIL()]}
          errorText='Please enter a valid email address.'
          onInput={inputHandler}
        />
        <Input
          element='input' 
          id='password'
          type='password'
          label='Password' 
          validators={[VALIDATOR_MINLENGTH(5)]} 
          errorText='Please enter a valid password, at least 5 characters.'
          onInput={inputHandler}
        />
        <Button type='submit' disabled={!formState.isValid}>
          {isLoginMode ? 
            "Log In": 
            "Sign Up"
          }
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>
        Switch to {isLoginMode ? 'Sign Up': 'Log In'}
      </Button>
    </Card>
  )
}

export default Auth