<?php

declare(strict_types=1);

namespace App\Scripts\Values;

use App\Profiles\Values\NamedCommand;
use App\Scripts\Enums\DiagnosticCode;
use App\Scripts\Exceptions\ScriptSyntaxError;

final readonly class Instruction
{
    /**
     * @param  array<string, string>  $successors
     */
    public function __construct(
        public string $keyword,
        public ScriptRange $source,
        public NamedCommand|BooleanOperand|TextOperand $operand,
        public array $successors,
    ) {}

    public function command(): NamedCommand
    {
        if (! $this->operand instanceof NamedCommand) {
            throw $this->wrongOperand();
        }

        return $this->operand;
    }

    public function condition(): BooleanOperand
    {
        if (! $this->operand instanceof BooleanOperand) {
            throw $this->wrongOperand();
        }

        return $this->operand;
    }

    public function text(): string
    {
        if (! $this->operand instanceof TextOperand) {
            throw $this->wrongOperand();
        }

        return $this->operand->text;
    }

    public function seconds(): int
    {
        return $this->operand instanceof NamedCommand ? $this->operand->timeoutSeconds : 0;
    }

    private function wrongOperand(): ScriptSyntaxError
    {
        return ScriptSyntaxError::at(DiagnosticCode::InvalidForm, $this->source, 'Unexpected instruction operand.');
    }
}
