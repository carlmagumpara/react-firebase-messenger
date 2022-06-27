import { useState, useEffect } from 'react';
import { Center, Flex, Box, Spacer, Heading, Input, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from 'react-redux-firebase';

function Index() {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const onChange = event => {
    event.persist();
    setForm(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value
    }));
  };

  const onSubmit = async event => {
    event.preventDefault();

    firebase.createUser({ 
      email: form.email, 
      password: form.password 
    },
    {
      first_name: form.first_name,
      last_name: form.last_name,
    });
  };

  return (
    <Center h="100vh">
      <Box p="3" w="400px">
        <form autoComplete="off" method="POST" onSubmit={onSubmit}>
          <Heading as="h1" size="md" mb="5">Register</Heading>
          <Input type="text" name="first_name" onChange={onChange} value={form.first_name} placeholder="First Name" mb="3" autoComplete="off" />
          <Input type="text" name="last_name" onChange={onChange} value={form.last_name} placeholder="Last Name" mb="3" autoComplete="off" />
          <Input type="email" name="email" onChange={onChange} value={form.email} placeholder="Email" mb="3" autoComplete="off" />
          <Input type="password" name="password" onChange={onChange} value={form.password} placeholder="Password" mb="3" autoComplete="new-password" />
          <Button colorScheme="teal" w="100%" mb="3" type="submit">
            Register
          </Button>
          <Button colorScheme="gray" w="100%" onClick={() => navigate('/login')}>
            Already have an account?
          </Button>
        </form>
      </Box>
    </Center>
  )
}

export default Index;