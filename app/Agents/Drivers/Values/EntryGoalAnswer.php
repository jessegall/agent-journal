<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Values;

use App\Values\ScriptParameter;

/**
 * The goal of a library entry as the host reads it: the key script, its version and its parameters by name.
 */
final readonly class EntryGoalAnswer
{
    /**
     * @param  list<ScriptParameter>  $parameters
     */
    private function __construct(
        public string $script,
        public int $version,
        public array $parameters,
    ) {}

    public static function of(ScriptGoal $goal): self
    {
        return new self($goal->script, $goal->version, ScriptParameter::listOf($goal->sortedParameters()));
    }
}
