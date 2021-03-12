# Project 2 Proposal - Digital Interactive Diagram Generator

## Chip Limeburner

**Artistic Vision**

	Within the field of digital humanities, particularly the historical study of books and manuscripts, there is an ongoing question of how best to represent books that contain interactive elements in the digital space. Components such as volvelles, tabs, flaps, string, and a myriad of other manipulable parts prove difficult to represent in photographs, while video or animated GIFs fail to impart the experience of interacting with these objects. However, many of those within the field (humanities scholars, museologists, etc) lack the technical knowledge to build fully interactive models from scratch. Consequently, I would propose designing an online platform that allows users to create these interactive book pages using uploaded images and a streamlined graphic user interface. The resulting diagram would then itself be exported as a self-contained HTML document containing integrated CSS and Javascript, suitable for embedding within an iframe on a blog, scholarly site, or exhibit software such as Omeka. The user interface for the editor is still in development subject to ongoing research, but initial designs (as seen in my GUI-prototype) borrow heavily from other image editing software such as Photoshop, using iconographic toolbars, layer systems, and sidebar parameters in roughly similar layouts. Each layer has a name that can be set, as well allowing users to upload an image. Furthermore, setting the layer “type” populates parameters for specific kind of transforms, such as rotation or translation, that allow for straightforward implementation of common historical book interactions.

**Technical Challenges**

	There are two main technical challenges this project presents: the very real possibility of scope creep, and determining a suitable method for exporting interactive diagrams once they have been created in the editor. To the first of these, there are so many kinds of interactive books one might want to digitize, that is is easy to create an intractable list of features the platform should support. To combat this, I am currently conducting user research to identify which features warrant priority attention for the scope of this assignment. Those features deemed desirable but of lower priority will be kept for possible future extensions to the project. To the second point, it has been determined that a single, self-contained HTML document that can be embedded in an iframe would be the optimal user solution, and so my plan is to procedural generate such a file with integrated style and javascript, which may then be dowloaded on the client side. This method of exporting is partially demonstrated by my Export-prototype, which uses a handful of very basic interactions to demonstrate procedurally generating an HTML file based on user input for use in either an iframe or download.

**Visual Design**

	The final visual design of my project will closely resemble the current layout of my GUI prototype, although minor changes will be made subject to user research and general aesthetic will be improved with modern flat design sensibilities. Features are outlined in accordance with the annotated diagram attached:


A - Move Button: Clicking this enable the tool for dragging the canvas (D) around the viewport.
B - Edit Button: Clicking this enables the tool for dragging transform points (E) around the canvas.
C - Play Button: Clicking this switches the diagram from an edit mode to a “live” mode where elements can be clicked and dragged in accordance with their layer type (G) dynamics.
D - Canvas: The space within which the diagram is constructed. Driven by P5.js.
E - Transform Points: Similar to an image in photoshop, layer images have transform points for their size, as well as layer type (G) dynamics such as rotation origin or axis of translation.
F - Toolbar: Properties of the active layer appear here. They update as elements are dragged around the canvas, but can also be updated direction from the textbooks themselves.
G - Layer Type: Setting layer type dictates the dynamics of that layer in the resultant diagram (ex: rotational, translation, flap, etc). Changing the layer type will also introduce new toolbar parameters associated with the appropriate transformation.
H - Move Layer Up Button: This shifts the layer up in the layer stack.
I - Move Layer Down Button: This shifts the layer down in the layer stack.
J - Create New Layer Button: This creates a new layer at the top of the stack.
