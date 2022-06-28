import { useState, useEffect, useRef } from 'react';
import { Center, Flex, Box, Spacer, Heading, Input, Button, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';
import { useFirestore } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { v4 } from 'uuid'; 
import Picker from 'emoji-picker-react';
import { FiSend } from 'react-icons/fi';

function Conversation({ conversation_id }) {
  const firestore = useFirestore();
  const { auth } = useSelector(state => ({ auth: state.firebase.auth }));
  const messagesRef = firestore.collection('messages');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState({
    message: '',
  });
  const [emoji_picker, setEmojiPicker] = useState(false);
  const messageEl = useRef(null);

  const getMessages = async () => {
    try {
      const snapshot = await messagesRef.doc(conversation_id).collection('messages').orderBy('created_at').get();

      setMessages(snapshot.docs.map(message => ({ ...message.data(), id: message.id })));
    } catch(error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = messagesRef.doc(conversation_id).collection('messages').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        if (change.type === "added") {
          console.log("Added: ", data);
          setMessages(prevState => ([...prevState, data]));
        }
        if (change.type === "modified") {
          console.log("Modified: ", data);
        }
        if (change.type === "removed") {
          console.log("Removed: ", data);
        }
      });
    });
  }, []);

  const onSubmit = async event => {
    event.preventDefault();

    if (!message.message) {
      return false;
    }

    const response = await messagesRef.doc(conversation_id).collection('messages').add({
      ...message,
      uid: v4(),
      user_uid: auth.uid,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    const data = await response.get();
    setMessages(prevState => ([...prevState, data.data()]));
    setMessage({ message: '' });
  };

  const onChange = event => {
    setMessage(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  };

  useEffect(() => {
    getMessages();
  }, [conversation_id]);

  useEffect(() => {
    if (messageEl) {
      setTimeout(() => {
        messageEl.current.addEventListener('DOMNodeInserted', event => {
          const { currentTarget: target } = event;
          target.scroll({ top: target.scrollHeight, behavior: 'auto' });
        });
      }, 100);
    }
  }, []);

  const messagesFilter = array => {
    console.log(array);
    const ids = array.map(o => o.uid);

    return array.filter(({ uid }, index) => !ids.includes(uid, index + 1));
  };

  const onEmojiClick = (event, emoji) => {
    setMessage(prevState => ({
      ...prevState,
      message: prevState.message + emoji.emoji
    }))
    setEmojiPicker(prevState => !prevState);
  }

  return (
    <div style={{ }}>
      <div style={{ height: 'calc((100vh - ((var(--chakra-space-4) * 2) + 80px)) - 45px)', overflowY: 'scroll' }} ref={messageEl}>
        {messagesFilter(messages || []).map(message => (
          <Flex>
            {message.user_uid === auth.uid ? <Spacer /> : null}
            <Box maxW='sm' borderWidth="1px" borderRadius="lg" overflow='hidden' mb="3" bg="white">
              <Box p="3">
                {message.message}
              </Box>
            </Box>
          </Flex>
        ))}
      </div>
      <div style={{ height: 45 }}>
        {emoji_picker ? (
        <div style={{ position: 'absolute', bottom: 'calc(var(--chakra-space-4) + 50px)', zIndex: 999 }}>
          <Picker 
            onEmojiClick={onEmojiClick} 
          />
        </div>
        ) : null}
        <form onSubmit={onSubmit}>
          <InputGroup>
            <InputLeftElement
              children={
                <div onClick={() => setEmojiPicker(prevState => !prevState)}>
                  😍
                </div>
              }
            />
            <Input 
              bg="white"
              name="message"
              style={{ height: 45 }} 
              value={message.message} 
              onChange={onChange} 
              variant="outline" 
              placeholder="Message here..." 
            />
            <InputRightElement>
              <Button h="45" size='sm' type="submit">
                <FiSend color="green.500" size="45" />
              </Button>
            </InputRightElement>
          </InputGroup>
        </form>
      </div>
    </div>
  )
}

export default Conversation;