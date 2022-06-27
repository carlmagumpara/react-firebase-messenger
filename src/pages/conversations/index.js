import { useState } from 'react';
import { Center, Flex, Box, Spacer, Heading, Input, Button } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import SidebarWithHeader from '../components/SidebarWithHeader';
import Conversation from './Conversation';

function Index() {
  const props = useParams();

  console.log(props);

  return (
    <SidebarWithHeader>
      <Conversation key={props.conversation_id} {...props} />
    </SidebarWithHeader>
  )
}

export default Index;