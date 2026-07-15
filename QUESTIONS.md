
---

**Explanation of the files:**
- `index.html` handles the Main Menu / Dashboard (where new rooms can be created)
- `editor.html` represents the CRDT Workspace where people can type.
- `style.css` holds the style for both `index.html` or `editor.html` (might change to two different files in the future)

--- 

**What does `<!DOCTYPE html>` do?**

---

**How does `display: flex` work?**

When one gives `display: flex` to an element, two things will happen:
- the element (parent of the elements that will follow) becomes a "Flex Container"
- the direct children become "Flex Items" (but only the direct children)

When `display: flex` is on, the normal rules don't apply really apply anymore, but there are new commands that can be used:
- `flex-direction` : Tell the items which way to flow, default is `row`, left to right, can be changed to `column` (top to bottom)   
- `justify-content` : Allign items along the main axis (horizontally, if in row). Can push the items in the center, space them even (`space-between`), or push them to the ends
- `align-items` : Aligns items along the cross (vertically, if in row), can be stretched to fill the container, or center in the middle


`display: flex` can be given to the body in order to center items more easily

---

**What is `rem`?**

`rem` stands for `Root EM`.

Instead of using fixed pixels, rem scales based on the default font size of the user's browser (which is usually 16px).
- 1rem = 16px
- 3rem = 48px 

---

**How does the blinking cursor work?**

```
        <h1 class="title">MultipleHelper<span class="cursor"></span></h1>
---------------------------------------------------
        .cursor::after {
            content: '█'; /* Can be changed with | */
            animation: blink 1s step-end infinite;
        }
        @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0; }
        } 
```

`<span>` is a blank wrapper for text, it has no style on its own.

`::after` is a pseudo-element in CSS, it injects content onto the page from the CSS file without typing it in HTML.

`animation: blink 1s step-end infinite;` 
- `blink` represents the name of the animation
- `1s` the duration, it takes 1 second to complete the whole cycle
- `step-end` stops the smooth animation and make it linear 
- `infinite` makes it infinite 

The `@keyframes` part:
- `0%` opacity 1
- `50%` opacity 0
(after that, it goes back to 0%, which will make it 1 again)


---
