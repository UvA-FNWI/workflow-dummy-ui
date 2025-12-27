import {Modal} from "antd";
import type {MessageProps} from "components/Messages/MessagesButton.tsx";
import {MessagesControl} from "components/Messages/MessagesControl.tsx";

interface Props {
  open: boolean
  onClose: () => void
}

export const MessagesDialog = ({ open, onClose, ...props }: Props & MessageProps) => {
  return <Modal open={open} onCancel={onClose} footer={null}>
    <MessagesControl {...props} onCancel={onClose} />
  </Modal>
}