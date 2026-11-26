<?php

declare(strict_types=1);

namespace App\Values;

use App\Models\Skills\SkillReadEntry;
use JsonSerializable;

/**
 * One skill as one session has it, each stage on its own: the stored revision, the generated digest, whether it is
 * selected now and why not, the generation the start handed it in, whether it changed since that start, and the last
 * time the agent read it whole. A file that exists is never counted as read.
 */
final readonly class SessionSkillStatus implements JsonSerializable
{
    public function __construct(
        public string $key,
        public int|null $storedRevision,
        public string|null $generatedDigest,
        public bool $isSelected,
        public string $selectionReason,
        public string|null $handedGeneration,
        public bool $hasChanged,
        public SkillReadEntry|null $lastRead,
    ) {}

    /**
     * Whether the start handed the session this skill, and in which generation.
     */
    public function handedText(): string
    {
        return $this->handedGeneration === null ? 'not handed' : "handed in {$this->handedGeneration}";
    }

    /**
     * When and how the agent last read it whole, or that it did not.
     */
    public function lastReadText(): string
    {
        if ($this->lastRead === null) {
            return 'not read';
        }

        return "{$this->lastRead->evidence->value} at {$this->lastRead->read_at->toIso8601String()}";
    }

    /**
     * @return array<string, string|int|bool|null>
     */
    public function jsonSerialize(): array
    {
        return [
            'key' => $this->key,
            'stored_revision' => $this->storedRevision,
            'generated_digest' => $this->generatedDigest,
            'selected' => $this->isSelected,
            'selection_reason' => $this->selectionReason,
            'handed_generation' => $this->handedGeneration,
            'changed_since_start' => $this->hasChanged,
            'last_read_evidence' => $this->lastRead?->evidence->value,
            'last_read_at' => $this->lastRead?->read_at->toIso8601String(),
        ];
    }
}
