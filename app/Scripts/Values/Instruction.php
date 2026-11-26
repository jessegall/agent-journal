<?php

declare(strict_types=1);

namespace App\Scripts\Values;

use App\Profiles\Enums\DiagnosticCode;
use App\Scripts\Exceptions\ScriptSyntaxError;
use App\Values\BooleanOperand;
use App\Values\NamedCommand;
use App\Values\ScriptOperand;
use App\Values\TextOperand;
use Spatie\LaravelData\Data;

/**
 * One compiled step of a script: its keyword, where it stands in the source, what it acts on and the instruction each
 * of its ports leads to.
 */
final class Instruction extends Data
{
    /**
     * @param  array<string, string>  $successors
     */
    public function __construct(
        public readonly string $keyword,
        public readonly ScriptRange $source,
        public readonly ScriptOperand $operand,
        public readonly array $successors,
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
