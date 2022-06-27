import { useState, useEffect } from 'react';
import { Center, Flex, Box, Spacer, Heading, Input, InputGroup,  Button, InputRightElement } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from 'react-redux-firebase';

function Index() {
  const firebase = useFirebase()
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [show_password, setShowPassword] = useState(false);

  const handleClick = () => setShowPassword(!show_password);

  const onChange = event => {
    event.persist();
    setForm(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value
    }));
  };

  const onSubmit = async event => {
    event.preventDefault();
    firebase.login(form);
  };

  return (
    <Center h="100vh">
      <Box p="3" w="400px">
        <Center>
          <Heading size="xl" fontFamily="monospace" fontWeight="bold" mb="5">
            Chatify
          </Heading>
        </Center>
        <form autoComplete="off" method="POST" onSubmit={onSubmit}>
          <Heading as="h1" size="md" mb="5">Login</Heading>
          <Input type="email" name="email" onChange={onChange} value={form.email} placeholder="Email" mb="3" autoComplete="off" />
          <InputGroup size='md'>
            <Input type={show_password ? 'text' : 'password'} name="password" onChange={onChange} value={form.password} placeholder="Password" mb="3" autoComplete="new-password" />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show_password ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Button colorScheme="teal" w="100%" mb="3" type="submit">
            Login
          </Button>
          <Button colorScheme="gray" w="100%" onClick={() => navigate('/register')}>
            Create an account
          </Button>
        </form>
      </Box>
    </Center>
  )
}

export default Index;