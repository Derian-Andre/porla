import "../scss/components/sidebar.scss";

import React from "react";
import { NavLink, To } from "react-router-dom";
import { Box, Button, HStack, VStack, Flex, IconButton, Link, useColorMode, Divider } from "@chakra-ui/react";
import { MdOutlineDashboard, MdOutlineSettings, MdOutlineTableRows, MdOutlineAddCircleOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { Porla } from "./brand";
import { QuickSearch } from "../components/QuickSearch";

interface SidebarItemProps {
  addon?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
  children: JSX.Element | string;
  icon: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
  rightIcon?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
  to: To;
}

function SidebarItem(props: SidebarItemProps) {
  const { colorMode } = useColorMode();

  return (
    <Button
      _activeLink={{
        fontWeight: 700,
        background: colorMode === "light" ? "blackAlpha.200" : "whiteAlpha.100",
      }}
      as={NavLink}
      borderRadius={"md"}
      justifyContent={"start"}
      leftIcon={props.icon}
      size={"md"}
      to={props.to}
      variant="ghost"
      w={"100%"}
    >
      <Flex
        alignItems={"center"}
        justifyContent={"space-between"}
        w={"100%"}
      >
        {props.children}
        {props.addon}
      </Flex>
    </Button>
  );
}

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <Flex
      id="sidebar"
      className="sidebar"
      borderRightWidth={1}
      direction="column"
      justifyContent="flex-end"
      height="100%"
      width="300px"
      px={3}
      py={5}
    >
      <Box flex={1}>
        <Box mb={5} px={2}>
          <Link href="./">
            <Porla height="32px"/>
          </Link>
        </Box>

        <QuickSearch />

        <Divider my={3} />

        <VStack>
          <SidebarItem
            icon={<MdOutlineDashboard aria-label={t("home")} />}
            to="/"
          >
            {t("home")}
          </SidebarItem>

          <SidebarItem
            addon={
              <IconButton
                aria-label={t("add_torrent")}
                as={NavLink}
                className={"btn-right"}
                borderRadius={"full"}
                icon={<MdOutlineAddCircleOutline size={"24px"}/>}
                position={"absolute"}
                right={0}
                to="/torrents/add"
                variant={"ghost"}
              />
            }
            icon={<MdOutlineTableRows aria-label={t("torrents")} />}
            to="/torrents"
          >
            {t("torrents")}
          </SidebarItem>
        </VStack>
      </Box>

      <Box>
        <SidebarItem
          icon={<MdOutlineSettings aria-label={t("settings")} />}
          to="/settings"
        >
          {t("settings")}
        </SidebarItem>
      </Box>
    </Flex>
  );
}
