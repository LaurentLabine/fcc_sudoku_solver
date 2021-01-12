const { puzzlesAndSolutions } = require("./puzzle-strings");

class SudokuSolver {  
  constructor() {  // Constructor
    this.status = {"conflict" : []};  // Class body
    this.convert = {A : 0, B : 1, C : 2, D : 3, E : 4, F : 5, G : 6, H : 7, I : 8};
  }

  validate(puzzleString) {

    if(puzzleString.length !== 81)
      return this.status = {error: 'Expected puzzle to be 81 characters long'}

    if (!/^[0-9.]*$/.test(puzzleString))
      return this.status = {error: 'Invalid characters in puzzle'}

    return true
  }

  check(puzStr, coordinate, value) {
    var row, col
    var res = {}
    this.status = {}

    if (!(puzStr !== undefined) || (!(coordinate !== undefined)) || (!(value !== undefined)))
      return this.status = {error : "Required field(s) missing" }

    this.validate(puzStr)

    if(this.status.error)//If validation flags errors, we stop the check here and return the error.  Otherwise we keep going
      return this.status

    if(!/^[a-iA-I]\d{1}$/.test(coordinate))//Coordinate invalid
      return this.status = {error: "Invalid coordinate"}

    row = coordinate.split('')[0].toUpperCase()
    col = coordinate.split('')[1]

    if(!/^\d{1}$/.test(value))//Value not between 0-9
      return this.status = {error : "Invalid value"}

    this.status = { "valid": true, "conflict": [] }

    this.checkColPlacement(puzStr,row,col,value)

    this.checkRowPlacement(puzStr,row,col,value)

    this.checkRegionPlacement(puzStr,row,col,value)

    if(this.status.conflict.length > 0)
      this.status.valid = false
    else
      this.status = {valid:true}

    return this.status
  }

  checkRowPlacement(puzzleString, row, column, value) {
    var startIndex = 0 + this.convert[row] * 9 //Index of the first element of that row.  First row index 0 to 8, second 9 to 17, etc...
    var row = puzzleString.slice(startIndex, startIndex + 9)

    if (row.indexOf(value) > -1)
     return this.status.conflict.push("row")
  }

  checkColPlacement(puzzleString, row, column, value) {
    var indexMult = parseFloat(column)
    var col = ""

    for(var i = indexMult; i <= puzzleString.length; i += 9)//Extracting the whole column as a string
      col+=puzzleString.substr(i-1,1)
    
    if (col.indexOf(value) > -1)
     return this.status.conflict.push("column")
  }

  checkRegionPlacement(puzzleString, row, column, value) {

    //Extract index in prom row and col
    var index = 9*(this.convert[row]) + parseFloat(column) - 1//removing one to convert to 0 based columns system

    if(puzzleString.substr(index,1) !== ".")//If there is already a value there, conflict!
      return this.status.conflict.push("region")

    var colInd, rowInd, upperColInd, upperRowInd
    var regArr = []

    //Region Row lower Limits
    var regRow = this.convert[row]/3
    var regCol = parseFloat(column)/3

    //Determine Start column of the region of the value
    if(regCol>2)
      colInd = 6
    else if(regCol > 1)
      colInd = 3
    else
      colInd = 0

    //Determine Start column of the region of the value
    if(regRow>=2)
      rowInd = 6
    else if(regRow >=1)
      rowInd = 3
    else
      rowInd = 0

    //Determine upperlimit Indexes
    upperColInd = colInd + 3
    upperRowInd = rowInd + 3        

    //Extract region
    for(var j = rowInd; j<upperRowInd; j++){//Row 
      for(var i = colInd; i < upperColInd; i++){//Column
        regArr.push(puzzleString.substr(i + 9*j,1))
      }
    }

    //Check if value already present in region
    if(regArr.includes(value))
      return this.status.conflict.push("region")
    else
      return
  }

  getKeyByValue(value) {
    return Object.keys(this.convert).find(key => this.convert[key] === value);
  }

  solve(puzzleString) {

    this.status = {}
    var potential = []//Array of array holding possibilities
    var ind = 0
    var coordinate
    var foundOne
    var count = 0;
    var val = ""

    if (!(puzzleString !== undefined))
        return {error : "Required field missing" }

    this.validate(puzzleString)

    if(this.status.error)//If validation flags errors, we stop the check here and return the error.  Otherwise we keep going
      return this.status

    //Validating that puzzle entered is valid
    for(var i = 0; i < 9 ; i++){//9 rows
      for(var j = 0; j < 9; j++){//9 Columns
        ind = j+1
        coordinate = this.getKeyByValue(i) + ind
         val = puzzleString.substr(count,1)
  
        if(val !== "."){
          if(!this.check(puzzleString.slice(0,count) + "." + puzzleString.slice(count+1),coordinate,val).valid)
            return { error: 'Puzzle cannot be solved' }
        }
        count++
      }
    }
    
    //Creating an array of 9x9x9 in order to store the prospects for each square.
    for(var i = 0; i< 9; i++)
    potential[i] = new Array(9) 

    foundOne = true

    while(foundOne){
      foundOne = 0
      count  = 0

      //every iteration of the puzzle we reset possible results to re evaluate
      for(var i = 0; i< 9; i++){
        for(var j = 0; j< 9; j++ ){
          potential[i][j] = new Array
        }
      }

      for(var i = 0; i < 9 ; i++){//9 rows
        for(var j = 0; j < 9; j++){//9 Columns
          ind = j+1 //My system is 0 based but the rest of the code takes A1 to A9 so i<m adjusting this here
          coordinate = this.getKeyByValue(i) + ind//Forming coordinate in a format the validate functions understands.
          count++ //Keeping a count so I know where to place the value found in the string.

          for(var k = 1; k < 10; k++)            
            if(this.check(puzzleString,coordinate,k.toString()).valid)//Evaluate 1-9 in every locations available locations
              potential[i][j].push(k)//Saves values that aare potential matches

            if(potential[i][j].length == 1){//Found Only One Possibility.  Replacing it in puzzleString and setting flag for another go.
              puzzleString = puzzleString.substr(0,count-1) + potential[i][j][0].toString() + puzzleString.substr(count)
              foundOne = true//As long as we find new match we keep going.
            }
        }
      }
    }
  return { solution : puzzleString}
  }
}

module.exports = SudokuSolver;

