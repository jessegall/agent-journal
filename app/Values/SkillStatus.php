<?php

declare(strict_types=1);

namespace App\Values;

use App\Skills\Values\GenerationReport;
use App\Skills\Values\HandedSkillsReport;
use JsonSerializable;

/**
 * The skills as the actor may see them: the newest generation, absent before the first refresh, and what the start of
 * each visible session was handed.
 */
final readonly class SkillStatus implements JsonSerializable
{
    /**
     * @param  list<HandedSkillsReport>  $sessions
     */
    public function __construct(
        public GenerationReport|null $generation,
        public array $sessions,
    ) {}

    /**
     * @return array{generation: array<string, string|null>|null, sessions: list<array<string, mixed>>}
     */
    public function jsonSerialize(): array
    {
        return [
            'generation' => $this->generation?->jsonSerialize(),
            'sessions' => array_map(fn (HandedSkillsReport $handed) => $handed->jsonSerialize(), $this->sessions),
        ];
    }
}
