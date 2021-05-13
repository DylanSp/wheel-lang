Module -> "module" Identifier Block ExportStatement:?

Block -> "{" Statement:* "}"

Statement -> FunctionDeclaration
           | ReturnStatement
					 | VariableDeclaration
		   		 | VariableAssignment
		   		 | IfStatement
		   		 | WhileStatement
					 | ExprStatement
					 | SetStatement
					 | ImportStatement
					 | ClassDeclaration
		 
FunctionDeclaration -> "function" Identifier "(" ParameterDeclarationList ")" Block

ParameterDeclarationList -> (Identifier ("," Identifier):*):?

ReturnStatement -> "return" LogicalExpression ";"

VariableDeclaration -> "let" Identifier ";"

VariableAssignment -> (PossibleCall "."):? Identifier "=" LogicalExpression ";"

IfStatement -> "if" "(" LogicalExpression ")" Block "else" Block
					   | "if" "(" LogicalExpression ")" Block "else" IfStatement

WhileStatement -> "while" "(" LogicalExpression ")" Block

ExprStatement -> LogicalExpression ";"

SetStatement -> LogicalExpression "." Identifier "=" LogicalExpression ";"

ImportStatement -> "import" Identifier ("," Identifier):* "from" Identifier ";"

ExportStatement -> "export" Identifier ("," Identifier):* ";"

ClassDeclaration -> "class" Identifier "{" MethodDeclaration:* ConstructorDeclaration:? MethodDeclaration:* "}"

ConstructorDeclaration -> "constructor" "(" ParameterDeclarationList ")" Block

MethodDeclaration -> Identifier "(" ParameterDeclarationList ")" Block


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
		
PossibleCall -> LiteralOrIdent CallSuffix:*

CallSuffix -> ("(" ArgumentList ")")
						| ("." Identifier)

ArgumentList -> (LogicalExpression ("," LogicalExpression):*):?
			
LiteralOrIdent -> Number
			    | Boolean
                | Identifier
					| ObjectLiteral
					| NullLiteral

ObjectLiteral -> "{" (ObjectField ("," ObjectField):*):? "}"

ObjectField -> Identifier ":" LogicalExpression
			   
Number -> [0-9]:+ ("." [0-9]:+):?

Boolean -> "true" | "false"

Identifier -> [a-zA-Z] [a-zA-Z0-9]:*

NullLiteral -> "null"