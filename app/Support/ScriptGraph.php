<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Profiles\DiagnosticCode;
use App\Exceptions\ScriptSyntaxError;
use App\Values\CompiledScript;
use App\Values\Instruction;
use App\Values\ScriptHandler;

final class ScriptGraph
{
    private const int EXECUTION_BUDGET = 900;

    /**
     * @var array<string, Instruction>
     */
    private array $instructions = [];

    /**
     * @var array<string, int>
     */
    private array $seconds = [];

    /**
     * @var array<string, mixed>
     */
    private array $definitions = [];

    /**
     * @param  list<string>  $ports
     */
    public function add(Instruction $instruction, array $ports): string
    {
        $actual = array_keys($instruction->successors);

        if (array_diff($ports, $actual) !== [] || array_diff($actual, $ports) !== []) {
            throw ScriptSyntaxError::at(DiagnosticCode::InvalidForm, $instruction->source, 'Invalid flow ports.');
        }

        $times = array_map($this->remainingSeconds(...), array_values($instruction->successors));

        $seconds = $instruction->seconds() + max([
            0,
            ...$times,
        ]);

        if ($seconds > self::EXECUTION_BUDGET) {
            throw ScriptSyntaxError::at(
                DiagnosticCode::ExecutionBudget,
                $instruction->source,
                'This branch exceeds the 900-second execution budget.',
            );
        }

        $id = 'line-'.$instruction->source->line;
        $this->instructions[$id] = $instruction;
        $this->seconds[$id] = $seconds;

        return $id;
    }

    public function remember(string $key, mixed $definition): void
    {
        $this->definitions[$key] = $definition;
    }

    public function addTerminal(string $terminal): void
    {
        $this->seconds[$terminal] = 0;
    }

    /**
     * @param  array<string, ScriptHandler>  $handlers  by trigger
     */
    public function compiled(array $handlers, string $sourceHash): CompiledScript
    {
        ksort($this->definitions);
        $digest = hash('sha256', json_encode($this->definitions, JSON_THROW_ON_ERROR));

        return new CompiledScript($sourceHash, $handlers, $this->instructions, $digest);
    }

    private function remainingSeconds(string $successor): int
    {
        return $this->seconds[$successor];
    }
}
