import type { NextPage } from "next";
import { useEffect, useState } from "react";

import { Box, Text, Button, Badge, useDisclosure } from "@chakra-ui/react";
import type { modes } from "../../@types/types";

import { Header, ChangeNetwork } from "../../components";
import { useWeb3 } from "@3rdweb/hooks";
import { supabase } from "../../utils/supabaseClient";

const MintPage: NextPage = () => {
  const { address, connectWallet, error } = useWeb3();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [env, setEnv] = useState<modes>();

  useEffect(() => {
    process.env.NODE_ENV === "development"
      ? setEnv("development")
      : process.env.NODE_ENV === "production"
      ? setEnv("production")
      : setEnv("test");
  }, [env, setEnv]);

  useEffect(() => {
    error?.name === "UnsupportedChainIdError" ? onOpen() : onClose();
  }, [error, onOpen, onClose]);

  const loginWithGithub = async () => {
    const { user, session, error } = await supabase.auth.signIn(
      {
        provider: "github",
      },
      {
        redirectTo:
          env === "development"
            ? "https://3000-kranurag-thirdwebsnippet-rf24ngqle54.ws-us38.gitpod.io/mint"
            : "https://www.thirdsnips.live/mint",
      }
    );
  };

  const user = supabase.auth.user();

  return (
    <>
      <ChangeNetwork isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      <Box
        h="100vh"
        w="100vw"
        overflowX="hidden"
        bgImage="https://res.cloudinary.com/didkcszrq/image/upload/v1647222804/background_gradient_mwbieb.svg"
        backgroundSize="cover"
      >
        <Header onHomePage={false} />

        <Box
          display="flex"
          flexDir="column"
          textAlign="center"
          justifyContent="center"
          fontFamily="syncopate"
          fontWeight="700"
          fontSize={{ base: "3xl", lg: "5xl" }}
          textColor="gray.700"
          mt="16"
        >
          <Text>cliam your early access NFT</Text>

          {address ? (
            <Text
              fontFamily="sen"
              fontWeight="400"
              textColor="gray.600"
              fontSize="xl"
            >
              wallet connected! claim your early access NFT
            </Text>
          ) : (
            <Text
              fontFamily="sen"
              fontWeight="400"
              textColor="gray.600"
              fontSize="xl"
            >
              please connect your wallet to continue
            </Text>
          )}

          {address && (
            <Box fontFamily="sen">
              <Badge
                px="4"
                py="1"
                rounded="full"
                fontSize="md"
                colorScheme="green"
              >
                {address}
              </Badge>
            </Box>
          )}

          <Box
            fontFamily="sen"
            my="4"
            display="flex"
            flexDir="column"
            justifyContent="center"
            alignItems="center"
            gap="4"
          >
            {address ? (
              <>
                <Button colorScheme="messenger">claim NFT</Button>
              </>
            ) : (
              <Button
                onClick={() => connectWallet("injected")}
                colorScheme="messenger"
              >
                connect wallet
              </Button>
            )}

            {user ? (
              <Text
                fontSize="xl"
                display="flex"
                flexDir="row"
                gap="1"
                alignItems="center"
              >
                hello,
                <Text color="gray.800">{user.user_metadata.full_name}</Text>
              </Text>
            ) : (
              <Button onClick={loginWithGithub} colorScheme="messenger">
                login with github
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MintPage;
