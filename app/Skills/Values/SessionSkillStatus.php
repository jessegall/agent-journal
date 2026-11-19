<?php

declare(strict_types=1);

namespace App\Skills\Values;

use JsonSerializable;

/**
 * One skill as one session has it, each stage on its own: the stored revision, the generated digest, whether it is
 * selected now and why not, the delivered generation, whether the agent read that text in this context, and whether
 * its program needs a new session to load it. A file that exists is never counted as read.
 */
final readonly class SessionSkillStatus implements JsonSerializable
{
    public function __construct(
        public string $key,
        public int|null $storedRevision,
        public string|null $generatedDigest,
        public bool $selected,
        public string $selectionReason,
        public string|null $deliveredGeneration,
        public string $deliveryState,
        public bool $loaded,
        public bool $needsNewSession,
    ) {}

    /**
     * Where its delivery stands, with the generation it came in when it was delivered.
     */
    public function deliveryText(): string
    {
        return $this->deliveredGeneration === null
            ? $this->deliveryState
            : "{$this->deliveryState} in {$this->deliveredGeneration}";
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
            'selected' => $this->selected,
            'selection_reason' => $this->selectionReason,
            'delivered_generation' => $this->deliveredGeneration,
            'delivery_state' => $this->deliveryState,
            'loaded' => $this->loaded,
            'needs_new_session' => $this->needsNewSession,
        ];
    }
}
