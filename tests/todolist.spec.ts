import mongoose from "mongoose"
import { test, expect } from "@playwright/test"
import connectDB from "../src/lib/mongodb"
import List from "../src/models/todolist"
import Item from "../src/models/todoitem"
const env = require("@next/env")

// test.beforeAll(async () => {

// })

// test.afterAll(async () => {
//   // console.log("After tests")
// })

test("shows todo list", async ({ page }) => {
  await page.goto("/")

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/NextJS Todo List/)

  // Expect a heading
  await expect(page.getByRole("heading", { name: "NextJS Todo List" })).toBeVisible()
})

test("add new List", async ({ page }) => {
  await page.goto("/")
  await page.click("#listName")
  await page.fill("#listName", "New List")
  await page.click("#buttonAddList")
  const selectedPage = await page.locator("#curr-list")
  await expect(selectedPage).toContainText("New List")
  // await page.screenshot({ path: "screenshot.png", fullPage: true })
})

test("add new Item", async ({ page }) => {
  await page.goto("/")
  await page.click("#taskName")
  await page.fill("#taskName", "New Task")
  await page.click("#buttonAddTask")
  // const items = await page.locator("#tasks-list > li")
  const items = await page.locator("#tasks-list").first()
  // console.log(items.innerText())

  // await expect(items).toContainText("New Task")
  await expect(items).toContainText("New Task")
  // await page.screenshot({ path: "screenshot1.png", fullPage: true })
})

// TODO: implement message on front end;
// test("show error when adding repeated List", async ({ page }) => {
// await page.goto("/")
// await page.click("#listName")
// await page.fill("#listName", "New List")
// await page.click("#buttonAddList")
// const selectedPage = await page.locator("#curr-list")
// await expect(selectedPage).toContainText("New List")
// })

// TODO: mark item as done;
// await expect(locator).toHaveCSS('display', 'flex');
// TODO: mark item as not done;
// TODO: mark item as done;
// TODO: delete item;
// TODO: navigate between lists and validate list title and items
