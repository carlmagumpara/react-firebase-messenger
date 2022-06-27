import { useState, useEffect } from 'react';
import { Center, Flex, Box, Spacer, Heading, Input, Button } from '@chakra-ui/react';
import { useFirestore } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

function Conversation({ conversation_id }) {
  const firestore = useFirestore();
  const messagesRef = firestore.collection('messages');
  const [messages, setMessages] = useState([]);

  const getMessages = async () => {
    try {
      const snapshot = await messagesRef.doc(conversation_id).collection('messages').get();

      setMessages(snapshot.docs.map(message => ({ ...message.data(), id: message.id })));
    } catch(error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMessages();
  }, [conversation_id]);

  return (
    <>
      {messages.map(message => (
        <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' mb="3">
          <Box p='6'>
            {message.message}
          </Box>
        </Box>
      ))}
    </>
  )
}

export default Conversation;