import React from "react";
import { Formik, Field } from "formik";
import { trpc } from "../utils/trpc";
import { Box, Button, FormControl, FormHelperText, FormLabel, Heading, Input } from "@chakra-ui/react";
import Loading from "../components/Loading";

function Add() {
  const config = trpc.useQuery(["config.get", ["default_save_path"]]);
  const addTorrent = trpc.useMutation(["torrents.add"]);

  if (!config.data) {
    return <Loading />
  }

  return (
    <>
      <Box
        backgroundColor={"#fff"}
        border="1px solid #f0f0f0"
        borderRadius={4}
        padding={3}
      >
        <Heading
          color={"#444"}
          marginBottom={3}
          size="md"
        >
          Add torrent
        </Heading>
        <Formik
          initialValues={{
            magnet_link: "",
            save_path: config.data.default_save_path || ""
          }}
          onSubmit={async (values) => {
            await addTorrent.mutateAsync(values)
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <FormControl
                marginBottom={3}
              >
                <FormLabel>Magnet link</FormLabel>
                <Field
                  as={Input}
                  id="magnet_link"
                  name="magnet_link"
                  placeholder="magnet:?xt=urn:btih: ..."
                  type="text"
                />
                <FormHelperText>The magnet link to add.</FormHelperText>
              </FormControl>

              <FormControl
                marginBottom={3}
              >
                <FormLabel>Save path</FormLabel>
                <Field
                  as={Input}
                  id="save_path"
                  name="save_path"
                  placeholder="/mnt/downloads"
                  type="text"
                />
                <FormHelperText>The full path to where the torrent should be saved.</FormHelperText>
              </FormControl>

              <Button
                colorScheme={"purple"}
                marginTop={3}
                size="sm"
                type="submit"
              >
                Add torrent
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </>
  );
}

export default Add;
