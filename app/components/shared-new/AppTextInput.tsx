import { TextInput as GrommetTextInput } from "grommet";
import styled from "styled-components";

import {
  borderSize,
  colors,
  edgeSize,
  fontFamily,
  fontWeight,
  text,
  transition,
} from "../../theme/theme-new";

type Props = {
  hasError?: boolean;
  id?: string;
  name?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value: string;
};

const StyledGrommetTextInput = styled(GrommetTextInput)`
  border-color: ${colors.fill20};
  border-radius: ${borderSize.small};
  border-width: ${borderSize.xsmall};
  color: ${colors.textDark};
  font-family: ${fontFamily.component};
  font-size: ${text.component.size};
  font-weight: ${fontWeight.normal};
  height: ${edgeSize.large};
  line-height: ${edgeSize.large};
  padding: 0 ${edgeSize.xsmall};
  transition: ${transition};

  &:focus {
    border-color: ${colors.primary5};
  }

  &::placeholder {
    color: ${colors.gray5};
  }
`;

export default function TextInput({
  hasError,
  id,
  name,
  onChange,
  placeholder,
  value,
}: Props): JSX.Element {
  return (
    <StyledGrommetTextInput
      id={id}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      style={hasError ? { borderColor: colors.danger5 } : undefined}
      value={value}
    />
  );
}
