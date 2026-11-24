<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\DiagnosticCode;
use App\Exceptions\ScriptSyntaxError;

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

    /**
     * How the instruction reads in a flowchart: its keyword and its operand.
     */
    public function label(): string
    {
        return "{$this->keyword} {$this->operand->label()}";
    }

    public function seconds(): int
    {
        if ($this->operand instanceof NamedCommand) {
            return $this->operand->timeoutSeconds;
        }

        return 0;
    }

    private function wrongOperand(): ScriptSyntaxError
    {
        return ScriptSyntaxError::at(DiagnosticCode::InvalidForm, $this->source, 'Unexpected instruction operand.');
    }
}
