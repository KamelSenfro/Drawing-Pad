class SketchPad {
   constructor(container, size = 400) {
      // Create canvas and set attributes
      this.canvas = document.createElement("canvas");
      this.canvas.width = size;
      this.canvas.height = size;
      this.canvas.classList.add("sketch-canvas"); // Add a CSS class
      container.appendChild(this.canvas);

      // Create UNDO button
      this.undoBtn = document.createElement("button");
      this.undoBtn.innerHTML = "UNDO";
      this.undoBtn.disabled = true;
      container.appendChild(this.undoBtn);

      // Get canvas rendering context
      this.ctx = this.canvas.getContext("2d");

      // Initialize paths and drawing state
      this.reset();

      // Add event listeners using event delegation
      container.addEventListener("mousedown", this.handleStartDrawing);
      container.addEventListener("mousemove", this.handleDrawing);
      document.addEventListener("mouseup", this.handleEndDrawing);
      container.addEventListener("touchstart", this.handleStartDrawing);
      container.addEventListener("touchmove", this.handleDrawing);
      document.addEventListener("touchend", this.handleEndDrawing);
      this.undoBtn.addEventListener("click", this.undoLastPath);
   }

   // Reset the drawing state and paths
   reset = () => {
      this.paths = [];
      this.isDrawing = false;
      this.redraw();
   };

   handleStartDrawing = (evt) => {
      const mouse = this.getMouse(evt);
      this.paths.push([mouse]);
      this.isDrawing = true;
   };

   handleDrawing = (evt) => {
      if (this.isDrawing) {
         const mouse = this.getMouse(evt);
         const lastPath = this.paths[this.paths.length - 1];
         lastPath.push(mouse);
         this.redraw();
      }
   };

   handleEndDrawing = () => {
      this.isDrawing = false;
   };

   undoLastPath = () => {
      this.paths.pop();
      this.redraw();
   };

   redraw = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // Draw paths
      this.paths.forEach((path) => {
         this.ctx.beginPath();
         path.forEach(([x, y]) => {
            this.ctx.lineTo(x, y);
         });
         this.ctx.stroke();
      });
      this.undoBtn.disabled = this.paths.length === 0;
   };

   getMouse = (evt) => {
      const rect = this.canvas.getBoundingClientRect();
      return [
         Math.round(evt.clientX - rect.left),
         Math.round(evt.clientY - rect.top),
      ];
   };
}
