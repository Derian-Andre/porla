import "../scss/pages/torrents.scss";

import React, { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import {
  Box, Center, CircularProgress, CircularProgressLabel, Flex,
  HStack, Icon, IconButton, Input, Link, InputLeftElement,
  InputGroup, Menu, MenuButton, MenuGroup, MenuItem, MenuList, Text,
  Table, Tbody, Td, Th, Thead, Tr,
  useColorMode, useDisclosure,
} from "@chakra-ui/react";
import { MdFilterList, MdFolder, MdOutlineFolder, MdMenu, MdPause, MdPlayArrow, MdOutlineGridView, MdOutlineMoreVert, MdDelete, } from "react-icons/md";
import filesize from "filesize";

import { getState, getStateColor, isPaused, } from "../utils/torrentStates";
import { trpc } from "../utils/trpc";

import Loading from "../components/Loading";
import ProgressLabel from "../components/ProgressLabel";
import { MoveTorrentModal } from "../components/MoveTorrentModal";
import { RemoveTorrentDialog } from "../components/RemoveTorrentDialog";

function Torrents() {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  const torrents = trpc.useQuery(["torrents.list"], {
    refetchInterval: 1000
  });

  const [tableSize, setTableSize] = useState("md");
  const [showCircularProgress] = useState(true);
  const [selectedTorrent, setSelectedTorrent] = useState({});

  const pause = trpc.useMutation(["torrents.pause"]);
  const resume = trpc.useMutation(["torrents.resume"]);

  const {
    isOpen: move_isOpen,
    onClose: move_onClose,
    onOpen: move_onOpen
  } = useDisclosure();

  const {
    isOpen: remove_isOpen,
    onClose: remove_onClose,
    onOpen: remove_onOpen
  } = useDisclosure();

  const changeTableSize = () => {
    switch (tableSize) {
      case "sm": setTableSize("md"); break;
      case "md": setTableSize("lg"); break;
      case "lg": setTableSize("sm"); break;
      default: setTableSize("md"); break;
    }
  };

  if (!torrents.data) {
    return <Loading />
  }

  return (
    <>
      <MoveTorrentModal
        isOpen={move_isOpen}
        onClose={move_onClose}
        onOpen={move_onOpen}
        torrent={selectedTorrent} />

      <RemoveTorrentDialog
        isOpen={remove_isOpen}
        onClose={remove_onClose}
        onOpen={remove_onOpen}
        torrent={selectedTorrent}
      />

      <HStack
        borderWidth={1}
        borderRadius={4}
        marginBottom={5}
        padding={3}
      >
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<MdFilterList />}
          />
          <Input
            placeholder={t("filter_torrent_list")}
          />
        </InputGroup>
        <IconButton
          aria-label={t("change_table_size")}
          icon={<MdOutlineGridView />}
          onClick={changeTableSize}
        />
        <IconButton
          aria-label={t("menu")}
          icon={<MdMenu />}
        />
      </HStack>
      <Box
        borderWidth={1}
        borderRadius={4}
        padding={0}
      >
        {torrents.data && torrents.data.length > 0 && (
          <Table className="table-torrents" size={tableSize}>
            <Thead>
              <Tr>
                {showCircularProgress && <Th w={"16px"}></Th>}
                <Th>{t("name")}</Th>
                <Th>{t("state")}</Th>
                <Th textAlign={"right"}>{t("size")}</Th>
                <Th textAlign={"right"}>{t("dl")}</Th>
                <Th textAlign={"right"}>{t("ul")}</Th>
                <Th textAlign={"right"}>{t("peers")}</Th>
                <Th textAlign={"right"} w={"16px"}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {torrents.data.map((item, idx) => {
                const state = getState(item);
                return (
                  <Tr key={idx}>
                    {showCircularProgress &&
                      <Td paddingEnd={0}>
                        <CircularProgress
                          color={getStateColor(state)}
                          value={item.progress*100}
                          size="30px"
                          thickness="10px"
                          trackColor={colorMode === "light" ? "blackAlpha.300" : "whiteAlpha.300"}
                        >
                          <CircularProgressLabel display={"flex"} alignItems={"center"} justifyContent={"center"}>
                            <ProgressLabel t={t} torrent={item} showNumber={true}/>
                          </CircularProgressLabel>
                        </CircularProgress>
                      </Td>
                    }
                    <Td>
                      <Box>
                        {item.name}
                      </Box>
                      <Flex
                        alignItems={"center"}
                        fontSize={"xs"}
                        opacity={.5}
                      >
                        <Icon
                          as={MdOutlineFolder}
                          marginEnd={1}
                          fontSize={"sm"}
                        />
                        {item.save_path}
                      </Flex>
                    </Td>
                    <Td>{t(state)}</Td>
                    <Td textAlign={"right"}>{filesize(item.size)}</Td>
                    <Td textAlign={"right"}>{item.download_payload_rate < 1024 ? "‒" : filesize(item.download_payload_rate)+"/s"}</Td>
                    <Td textAlign={"right"}>{item.upload_payload_rate   < 1024 ? "‒" : filesize(item.upload_payload_rate)+"/s"}</Td>
                    <Td textAlign={"right"}>{item.num_peers === 0 ? "‒" : item.num_peers}</Td>
                    <Td paddingStart={0}>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<MdOutlineMoreVert size={22} />}
                          size={tableSize}
                          variant="ghost"
                        />
                        <MenuList>
                          <MenuGroup title={t("actions")}>
                            {isPaused(item.flags)
                              ? <MenuItem
                                  icon={<MdPlayArrow size={16} />}
                                  onClick={async () => {
                                    await resume.mutateAsync(item.info_hash)
                                  }}
                                >
                                  {t("resume")}
                                </MenuItem>
                              : <MenuItem
                                  icon={<MdPause size={16} />}
                                  onClick={async () => {
                                    await pause.mutateAsync(item.info_hash);
                                  }}
                                >
                                  {t("pause")}
                                </MenuItem>
                            }
                            <MenuItem
                              icon={<MdFolder size={16} />}
                              onClick={() => {
                                setSelectedTorrent(item);
                                move_onOpen();
                              }}
                            >
                              {t("move")}
                            </MenuItem>
                            <MenuItem
                              icon={<MdDelete size={16} />}
                              onClick={() => {
                                setSelectedTorrent(item);
                                remove_onOpen();
                              }}
                            >
                              {t("remove")}
                            </MenuItem>
                          </MenuGroup>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        )}
        {torrents.data.length === 0 && (
          <Center padding={10}>
            <Text fontSize="lg">
              <Trans i18nKey="no_torrents" components={[<Link className="text-underline" href="/torrents/add"/>]}/>
            </Text>
          </Center>
        )}
      </Box>
    </>
  );
}

export default Torrents;
