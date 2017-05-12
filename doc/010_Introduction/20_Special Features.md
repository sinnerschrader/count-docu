
# Callout

There are three different callouts : warning, danger and info.

````md
 > [[danger]]  __headline__
 > Here comes the important info
 >
 ````
 
> [[danger]] __headline__
>
> Here comes the important info
>


# Link to Chapter


````md
[Link to Documentation](ref:/Introduction/Documentation)
 ````
 
 [Link to Documentation](ref:/Introduction/Documentation)
 
 Links are checked at generation time and broken links fail the generation.
 
 # Copy to Clipboard Button
 
 Adding a copy to clipboard button by extending the language in a code by "|ctc". All code inside the block will be copied.
 The button will appear while hovering over the code block.
 
 ````md|ctc
 this text will be copied to the clipboard
 ````