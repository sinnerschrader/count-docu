
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
 
 A copy to clipboard button will added to all code blocks by default. This can be overruled by the adding "|noctc".


     ```` md|noctc
     this code has no copy to clipboard button 
     ```` 
   
 
 ````md|noctc
 this code has no copy to clipboard button
 ````
 
      ```` md
      this code has a copy to clipboard button 
      ```` 
    
  
  ````md
  this code has a copy to clipboard button
  ````