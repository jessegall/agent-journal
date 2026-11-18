<?php

declare(strict_types=1);

namespace App\Skills\Data;

use Spatie\LaravelData\Data;

/**
 * Whether one agent's selection holds a skill, with the reason when it does not, and the agent's whole selection.
 */
final class SkillAgentSelection extends Data
{
    /**
     * @param  list<string>  $selection
     */
    public function __construct(
        public readonly string $key,
        public readonly string $agent,
        public readonly bool $selected,
        public readonly string $reason,
        public readonly array $selection,
        public readonly string $digest,
    ) {}

    /**
     * The answer as the console prints it.
     */
    public function summary(): string
    {
        $outcome = $this->selected ? 'selected' : "not selected ({$this->reason})";
        $selection = $this->selection === [] ? 'none' : implode(', ', $this->selection);

        return "Skill {$this->key} for agent {$this->agent}: {$outcome}\nSelected for this agent: {$selection}";
    }
}
