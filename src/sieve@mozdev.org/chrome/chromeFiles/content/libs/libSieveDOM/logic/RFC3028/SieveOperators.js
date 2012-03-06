/******************************************************************************/

// Unary operators
SieveNotOperator.isElement
  = function(token)
{ 
  if (token.substring(0,3).toLowerCase().indexOf("not") == 0)
    return true;

  return false;
}

function SieveNotOperator(docshell,id) 
{
  // first line with deadcode
  SieveAbstractElement.call(this,docshell,id);
  
  this.whiteSpace = []
  this.whiteSpace[0] = this._createByName("whitespace", " ");
  this.whiteSpace[1] = this._createByName("whitespace");
 // this.test = this._createByName("operator");
}

SieveNotOperator.prototype.__proto__ = SieveAbstractElement.prototype;

SieveNotOperator.prototype.init
    = function (data)
{
  // Syntax :
  // <"not"> <test>
  
  data = data.slice("not".length);  
  data = this.whiteSpace[0].init(data);  
    
  if (this._probeByClass(["test","operator"],data) == false) 
    throw "Test command expected but found:\n'"+data.substr(0,50)+"'...";                 

  this._test = this._createByClass(["test","operator"],data)
  data = this._test.init(data);
    
  if (this._probeByName("whitespace",data))
    data = this.whiteSpace[1].init(data);  
  
  return data;
    
}

SieveNotOperator.prototype.test
    = function (item)
{
  if (typeof(item) === "undefined")
   return this._test;
  
   if (item.parent())
     throw "test already bound to "+item.parent().id();
     
  // Release old test...
  if (this._test)
    this._test.parent(null);
    
  // ... and bind new test to this node
  this._test = item.parent(this);
  
  return this;
}

SieveNotOperator.prototype.toScript
    = function ()
{
  return "not"
    + this.whiteSpace[0].toScript()
    + this._test.toScript()
    + this.whiteSpace[1].toScript();
}

SieveNotOperator.prototype.toWidget
    = function()
{
  return (new SieveNotUI(this));
}

//****************************************************************************//

//N-Ary Operator
//****************************************************************************/
function SieveAnyOfAllOfTest(docshell,id)
{
  SieveTestList.call(this,docshell,id);  
  this.whiteSpace = this._createByName("whitespace");
}

// Inherrit TestList
SieveAnyOfAllOfTest.prototype.__proto__ = SieveTestList.prototype;

SieveAnyOfAllOfTest.isElement
   = function (token)
{
  if ( token.substring(0,5).toLowerCase().indexOf("allof") == 0)
    return true;
    
  if ( token.substring(0,5).toLowerCase().indexOf("anyof") == 0)
    return true;
    
  return false;
}

SieveAnyOfAllOfTest.prototype.init
    = function (data)
{
  if ("allof" == data.substring(0,5).toLowerCase())
    this.isAllOf = true;
  else if ("anyof" == data.substring(0,5).toLowerCase())
    this.isAllOf = false;
  else
    throw "allof or anyof expected but found: \n"+data.substr(0,50)+"...";
    
  data = data.slice(5);  
  data = this.whiteSpace.init(data);
  
  data = SieveTestList.prototype.init.call(this,data);
  
  return data;
}

SieveAnyOfAllOfTest.prototype.test
    = function (item)
{
  if (typeof(item) === "undefined")
  {
    if (this.tests.length == 1)
     return this.tests[0][1];
    
    throw ".test() has more than one element";
  }
  
  if (item.parent())
     throw "test already bound to "+item.parent().id();
     
  // Release old test...
  this.append(item)
  
  /*if (this._test)
    this._test.parent(null);
    
  // ... and bind new test to this node
  this._test = ;*/
  
  return this;
}

SieveAnyOfAllOfTest.prototype.toScript
    = function()
{
  return (this.isAllOf?"allof":"anyof")
           + this.whiteSpace.toScript()
           + SieveTestList.prototype.toScript.call(this);  
}

SieveAnyOfAllOfTest.prototype.toWidget
    = function ()
{
  return (new SieveAnyOfAllOfUI(this));
}



if (!SieveLexer)
  throw "Could not register Conditional Elements";


SieveLexer.register("operator","operator/not",SieveNotOperator);
SieveLexer.register("operator","operator/anyof",SieveAnyOfAllOfTest);
            