import styled from "@emotion/styled"
import React from "react"
import { GiEvilMoon } from "react-icons/gi"
import { MdWbSunny } from "react-icons/md"
import Switch from "react-switch"
import useDarkMode from "use-dark-mode"

const Container = styled.div`
  display: flex;
`

const Icon = ({ icon: IconComponent }) => {
  return <IconComponent size="20px" style={{ margin: "4px 5px 4px 5px" }} />
}

export const ThemeToggle = ({ className }) => {
  const darkMode = useDarkMode(false, {
    classNameDark: "dark",
    classNameLight: "light",
  })

  return (
    <Container className={className}>
      <Switch
        checked={darkMode.value}
        onChange={darkMode.toggle}
        onColor="#000"
        offColor="#ffe81c"
        offHandleColor="#000"
        checkedIcon={<Icon icon={GiEvilMoon} />}
        uncheckedIcon={<Icon icon={MdWbSunny} />}
      />
    </Container>
  )
}
