<?php

declare(strict_types=1);

namespace App\Scripts\Values;

use App\Scripts\Enums\DiagnosticCode;
use App\Scripts\Exceptions\ScriptSyntaxError;

final readonly class ParsedStatement
{
    public function __construct(
        public KeywordDefinition $keyword,
        public ScriptRange $source,
        public ScriptRange $operandSource,
        public CommandOperand|BooleanOperand|TextOperand|BlockOperand $operand,
    ) {}

    public function commandKey(): string
    {
        if (! $this->operand instanceof CommandOperand) {
            throw ScriptSyntaxError::at(DiagnosticCode::InvalidForm, $this->source, 'Expected a command key.');
        }

        return $this->operand->key;
    }
}
