Program -> Block

Block -> "{" Statement:* "}"

Statement -> FunctionDeclaration
           | ReturnStatement
					 | VariableDeclaration
		   		 | VariableAssignment
		   		 | IfStatement
		   		 | WhileStatement
		 
FunctionDeclaration -> "function" Identifier "(" ParameterDeclarationList ")" Block

ParameterDeclarationList -> (Identifier ("," Identifier):*):?

ReturnStatement -> "return" LogicalExpression ";"

VariableDeclaration -> "let" Identifier ";"

VariableAssignment -> Identifier "=" LogicalExpression ";"

IfStatement -> "if" "(" LogicalExpression ")" Block "else" Block
					   | "if" "(" LogicalExpression ")" Block "else" IfStatement

WhileStatement -> "while" "(" LogicalExpression ")" Block




LogicalExpression -> LogicalTerm (OrOp LogicalTerm):*

OrOp -> "|"

LogicalTerm -> Relation (AndOp Relation):*

AndOp -> "&"

Relation -> Expression (RelOp Expression):?
		  
RelOp -> "<" | ">" | "<=" | ">=" | "==" | "/="

Expression -> Term (AddOp Term):*

AddOp -> "+" | "-"

Term -> Factor (MulOp Factor):*

MulOp -> "*" | "/"

FactorWithUnary -> UnaryOp:? Factor

UnaryOp -> "!" | "-"

Factor -> "(" LogicalExpression ")"
        | PossibleCall
		
PossibleCall -> LiteralOrIdent ("(" ArgumentList ")"):*

ArgumentList -> (LogicalExpression ("," LogicalExpression):*):?
			
LiteralOrIdent -> Number
			    | Boolean
                | Identifier
			   
Number -> [0-9]:+ ("." [0-9]:+):?

Boolean -> "true" | "false"

Identifier -> [a-zA-Z] [a-zA-Z0-9]:*
