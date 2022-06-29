import React, { ReactNode, useState, useEffect } from 'react';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Input,
  Heading
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiUser
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LinkItems = [
  { name: 'Home', icon: FiHome },
  { name: 'Trending', icon: FiTrendingUp },
  { name: 'Explore', icon: FiCompass },
  { name: 'Favourites', icon: FiStar },
  { name: 'Settings', icon: FiSettings },
];

export default function SidebarWithHeader({
  children,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }}>
        {children}
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const { auth } = useSelector(state => ({ auth: state.firebase.auth }));
  
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);

  const profilesRef = firestore.collection('profiles');
  const conversationsRef = firestore.collection('conversations');
  const messagesRef = firestore.collection('messages');
  const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

  useEffect(() => {
    getConversations();
  }, []);

  const getConversations = async () => {
    try {
      const q = await conversationsRef.where('participants', 'array-contains-any', [auth.uid]).get();

      const results = await Promise.all(q.docs.map(async conversation => {
        const data = conversation.data();
        const conversation_ = { id: conversation.id, ...data };
        const profiles = await profilesRef.where(firestore.FieldPath.documentId(), 'in', data.participants).get();
        conversation_.participants = profiles.docs.map(profile => ({
          id: profile.id,
          ...profile.data(),
        }));

        return conversation_;
      }));

      setConversations(results);
    } catch(error) {
      console.log(error);
    }
  };

  const searchUser = async term => {
    try {
      const q = await firestore.collection('profiles').orderBy('case_insensitive.first_name').startAt(term.toLowerCase()).endAt(term.toLowerCase() + '~').get();

      setUsers(q.docs.map(user => ({ id: user.id, ...user.data() })));
    } catch(error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (search) {
      searchUser(search);
    }
  }, [search]);

  const createOrViewConversation = user => async () => {
    try {
      const conversation = await conversationsRef.add({
        participants: [user.id, auth.uid],
        started_by: auth.uid,
        created_at: Date.now(),
        updated_at: Date.now(),
      });

      setSearch('');
      navigate(`/conversations/${conversation.id}`);
    } catch(error) {
      console.log(error);
    }
  };

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Chatify
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Box p="3">
        <Input 
          value={search} 
          onChange={event => setSearch(event.target.value)} 
          placeholder="Search User..."
        />
      </Box>
      {(search && users.length) ? (
        <>
          <Heading size="md">Users</Heading>
          {users.map(user => (
            <NavItem key={user.id} icon={() => <Avatar size="sm" mr="3" name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />} onClick={createOrViewConversation(user)}>
              {user.first_name} {user.last_name}
            </NavItem>
          ))}
        </>
      ) : (
        <>
          {conversations.map(conversation => (
            <NavItem 
              key={conversation.id} 
              icon={() => <Avatar size="sm" mr="3" name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />} 
              onClick={() => navigate(`/conversations/${conversation.id}`)}
            >
              {formatter.format(conversation.participants.filter(profile => profile.id !== auth.uid).map(profile => (`${profile.first_name} ${profile.last_name}`)))}
            </NavItem>
          ))}
{/*          {LinkItems.map((link) => (
            <NavItem key={link.name} icon={link.icon}>
              {link.name}
            </NavItem>
          ))}*/}
        </>
      )}
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Link href="#" 
      style={{ 
        whiteSpace: "normal",
        wordWrap: "break-word",
        textDecoration: 'none' 
      }} 
      _focus={{ 
        boxShadow: 'none' 
      }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const {  auth, profile } = useSelector(state => ({ auth: state.firebase.auth, profile: state.firebase.profile }));

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        Chatify
      </Text>
      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{profile.first_name} {profile.last_name}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {auth.email}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => firebase.logout()}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};