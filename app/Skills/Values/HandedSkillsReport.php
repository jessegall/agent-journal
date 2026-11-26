<?php

declare(strict_types=1);

namespace App\Skills\Values;

use App\Models\Agents\AgentSession;
use JsonSerializable;

/**
 * The generation and the skill keys one session's start was handed; a session started before the first refresh was
 * handed none.
 */
final readonly class HandedSkillsReport implements JsonSerializable
{
    /**
     * @param  list<string>  $skillKeys
     */
    public function __construct(
        public string $sessionId,
        public string|null $generationId,
        public array $skillKeys,
    ) {}

    public static function of(AgentSession $session): self
    {
        return new self($session->id, $session->skill_generation_id, $session->skill_keys ?? []);
    }

    /**
     * @return array{session: string, generation: string|null, skills: list<string>}
     */
    public function jsonSerialize(): array
    {
        return [
            'session' => $this->sessionId,
            'generation' => $this->generationId,
            'skills' => $this->skillKeys,
        ];
    }
}
