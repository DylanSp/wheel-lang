Program -> Block

Block -> "{" Statement:* "}"

Statement -> FunctionDeclaration
           | ReturnStatement
		   | VariableAssignment
		 
FunctionDeclaration -> "function" Identifier "(" ParameterDeclarationList ")" Block

ParameterDeclarationList -> (Identifier ("," Identifier):*):?

ReturnStatement -> "return" Expression ";"

VariableAssignment -> Identifier "=" Expression ";"

Expression -> Term (AddOp Term):*

AddOp -> "+" | "-"

Term -> Factor (MulOp Factor):*

MulOp -> "*" | "/"

Factor -> "(" Expression ")"
        | Call
		
# May rename this; see TODO in parser.ts
Call -> NumberOrIdent ("(" ArgumentList ")"):*

ArgumentList -> (Expression ("," Expression):*):?
			
NumberOrIdent -> Number
               | Identifier
			   
Number -> [0-9]:+ ("." [0-9]:+):?

Identifier -> [a-zA-Z] [a-zA-Z0-9]:*
