import { useState } from 'react';
import { Center, Flex, Box, Spacer, Heading, Input, Button } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import SidebarWithHeader from '../components/SidebarWithHeader';
import Conversation from './Conversation';

function Index() {
  const props = useParams();

  return (
    <SidebarWithHeader>
      {props.conversation_id ? <Conversation key={props.conversation_id} {...props} /> : null}
    </SidebarWithHeader>
  )
}

export default Index;