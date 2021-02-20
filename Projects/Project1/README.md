#Stakeout

##Chip Limeburner

**Artist's Statement**

*Stakeout* is an interactive storytelling experience inspired by the thematic content of movies such as [House on Haunted Hill](https://en.wikipedia.org/wiki/House_on_Haunted_Hill), and [Clue](https://en.wikipedia.org/wiki/Clue_(film)), as well as the narrative framing of [Rear Window](https://en.wikipedia.org/wiki/Rear_Window). Players are positioned outside an old mansion, looking in at its inhabitants through the lens of a camera. With nothing but a telephoto lens at their disposal, players can watch the inhabitants move about the house but are otherwise separated from broader context of what's taking place inside. In this vacuum of meaning, the player is left to take photos and construct their own understanding of the events.

Mechanically, the main technology the experience makes use of is serial communications between an Arduino microcontroller and the javascript browser session via a locally run p5.serialcontrol server. This allows for greater immersion as the Arduino microcontroller is used as a camera-like controller, emulating not only the manual winding of film and photo-taking, but even the experience of vision becoming zoomed-in when lifting a camera's view finder to one's eye. This is achieved with a photo-resistor that detects when the camera is held down (zoomed out) and when it is raised to the face (zoomed in).
