import { Box, DialogProps, Typography, DialogContent, DialogActions, Button, TextField, TextFieldProps } from "@mui/material";
import React, { ReactNode, useState, useEffect } from "react";
import { DialogOption } from "./DialogProvider";
import { useDialog } from "./useDialog";

type DialogRenderer<TResult>
    = (close: (result: TResult) => void) => React.ReactNode;

interface DialogHandler {
    showAsync: <TResult = any>(renderer: DialogRenderer<TResult>, options?: DialogOption)
        => Promise<TResult>;
    close: () => void;
    setOption: (option: DialogOption) => void;
}

interface InputDialogOption extends DialogOption {
    hideCancel?: boolean;
    cancelText?: string;
    okText?: string;
    defaultText?: string;
    textFieldProps?: TextFieldProps;
}

export const useIntupDialog = () => {
    const { showAsync, close, setOption } = useDialog();
    const showMessageAsync = async (message: string, subMessage?: string | ReactNode, options?: InputDialogOption): Promise<string | null> => {
        return await showAsync<string | null>(close => {
            return React.createElement(() => {
                const [text, setText] = useState(options?.defaultText ?? "");

                const ok = () => {
                    close(text);
                };

                const cancel = () => {
                    close(null);
                };

                useEffect(() => {
                    if (options) {
                        setOption(options);
                    }
                }, [options]);

                return (
                    <>
                        <DialogContent>
                            <Box>
                                <Box p={3} pb={0}>
                                    <Typography variant="h5">{message}</Typography>
                                </Box>
                                {
                                    !!subMessage && <Box px={3} mt={2}  >
                                        <Typography variant="body2">{subMessage}</Typography>
                                    </Box>
                                }
                                <Box p={3}>
                                    <TextField
                                        {...options?.textFieldProps}
                                        onChange={e => setText(e.target.value)}
                                        fullWidth={options?.fullWidth ?? true}
                                    />
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            {options?.hideCancel !== false &&
                                <Button onClick={cancel}>{"CANCEL"}</Button>
                            }
                            <Button color="primary" onClick={ok}>{"OK"}</Button>
                        </DialogActions>
                    </>
                );
            });
        }, options);
    };

    return { showMessageAsync, close, setOption };
};
