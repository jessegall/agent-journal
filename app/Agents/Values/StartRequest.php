<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\StartOriginType;
use App\Records\Support\RecordIdentity;

/**
 * One request to start an agent: its id, which makes a repeat find the same start, the agent, the selected
 * program and model, who asked and for what, how the conversation starts and where it runs. It holds no credential.
 */
final readonly class StartRequest
{
    public function __construct(
        public string $requestId,
        public string $agentId,
        public SelectedDriver $selection,
        public StartOriginType $origin,
        public string|null $ownerReference,
        public string|null $contextReference,
        public ConversationModeType $conversationMode,
        public string|null $parentSessionId,
        public StartPolicy $policy,
        public RecordIdentity|null $authorizedSource = null,
        public string|null $conversationTarget = null,
    ) {}

    public function execution(): ExecutionPolicy
    {
        return $this->policy->execution;
    }

    /**
     * The fingerprint of everything the request asks, so a repeat under the same id can be told from a changed one.
     */
    public function digest(): string
    {
        $requested = $this->selection->requested;
        $source = $this->selection->source;

        return hash('sha256', json_encode([
            $this->agentId,
            $this->selection->driver->value,
            $this->selection->model,
            $requested->type->value,
            $requested->model,
            $source->driverSource->value,
            $source->profileKey,
            $source->profileRevision,
            $this->origin->value,
            $this->ownerReference,
            $this->contextReference,
            $this->conversationMode->value,
            $this->parentSessionId,
            $this->policy->digest(),
            $this->authorizedSource,
            $this->conversationTarget,
        ], JSON_THROW_ON_ERROR));
    }
}
