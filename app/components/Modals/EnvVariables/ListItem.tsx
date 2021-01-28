import { Box } from "grommet";
import { EnvironmentVariable } from "../../../lib/types";
import { copy } from "../../../theme/copy";
import { overflowStyle } from "../../../theme/theme-new";
import Text from "../../shared-new/Text";
import EditDeleteButtons, {
  StyledBox,
} from "../../shared-new/EditDeleteButtons";
import { useState } from "react";
import Form from "./Form";

type Props = {
  editEnvironmentVariableId: string;
  environmentVariable: EnvironmentVariable;
  onCancelClick: () => void;
  onEditClick: (editEnvironmentVariableId: string) => void;
};

export const nameWidth = "220px";

export default function ListItem({
  editEnvironmentVariableId,
  environmentVariable,
  onCancelClick,
  onEditClick,
}: Props): JSX.Element {
  const [isHover, setIsHover] = useState(false);

  if (environmentVariable.id === editEnvironmentVariableId) {
    return (
      <Form
        environmentVariable={environmentVariable}
        onCancelClick={onCancelClick}
      />
    );
  }

  const handleEditClick = (): void => {
    setIsHover(false);
    onEditClick(environmentVariable.id);
  };

  return (
    <StyledBox
      align="center"
      direction="row"
      flex={false}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Box
        flex={false}
        margin={{ right: "xxsmall", vertical: "small" }}
        width={nameWidth}
      >
        <Text color="gray9" size="component" style={overflowStyle}>
          {environmentVariable.name}
        </Text>
      </Box>
      <Box align="center" direction="row" justify="between" width="full">
        <Text
          color={isHover ? "gray9" : "gray7"}
          margin={{ right: "xxsmall" }}
          size="component"
          style={overflowStyle}
        >
          {isHover ? environmentVariable.value : copy.encrypted}
        </Text>
        <EditDeleteButtons
          onDeleteClick={() => {}}
          onEditClick={handleEditClick}
        />
      </Box>
    </StyledBox>
  );
}
