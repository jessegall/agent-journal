<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\LaunchOriginType;

/**
 * One request to launch an agent: its id, which makes a repeat find the same launch, the agent, the selected
 * program and model, who asked and for what, and how the conversation starts. It holds no credential.
 */
final readonly class LaunchRequest
{
    public function __construct(
        public string $requestId,
        public string $agentId,
        public SelectedProgram $selection,
        public LaunchOriginType $origin,
        public string|null $ownerReference,
        public string|null $contextReference,
        public ConversationModeType $conversationMode,
        public string|null $parentSessionId,
    ) {}

    /**
     * The fingerprint of everything the request asks, so a repeat under the same id can be told from a changed one.
     */
    public function digest(): string
    {
        return hash('sha256', json_encode([
            $this->agentId,
            $this->selection->program->value,
            $this->selection->model,
            $this->selection->requested->type->value,
            $this->selection->requested->model,
            $this->selection->source->programSource->value,
            $this->selection->source->profileKey,
            $this->selection->source->profileRevision,
            $this->origin->value,
            $this->ownerReference,
            $this->contextReference,
            $this->conversationMode->value,
            $this->parentSessionId,
        ], JSON_THROW_ON_ERROR));
    }
}
