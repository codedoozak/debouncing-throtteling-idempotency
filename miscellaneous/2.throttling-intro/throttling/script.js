

const onScrollHandler = ()=>{
    console.log("Scrolling ..." );
        
    }


    const throttledOnScrollHandler =throttle(onScrollHandler , 400)


document.addEventListener("scroll", throttledOnScrollHandler)





function throttle(mainFunction, delay) {
    let timerFlag = null;  
  
    // Returning a throttled version 
    return (...args) => {
      if (timerFlag === null) { // If there is no timer currently running
        mainFunction(...args); // Execute the main function 
        timerFlag = setTimeout(() => { // Set a timer to clear the timerFlag after the specified delay
          timerFlag = null; // Clear the timerFlag to allow the main function to be executed again
        }, delay);
      }
    };
  }