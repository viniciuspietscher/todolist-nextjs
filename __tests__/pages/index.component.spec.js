import Home from "../../src/pages/index"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
// import { childNodes } from "dom-helpers"

describe("Test Home Component", () => {
  const props = { lists: [], items: [] }
  const component = render(<Home lists={props.lists} items={props.items} />)
  screen.debug()
  // console.log(component)
})
