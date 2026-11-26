<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Agents\ConversationModeType;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Drivers\DriverCapability;
use App\Enums\Drivers\DriverType;
use App\Enums\Sessions\StartOriginType;
use App\Support\RecordIdentity;

/**
 * One request to start an agent: its id, which makes a repeat find the same start, the agent, the selected
 * driver and model, who asked and for what, how the conversation starts and where it runs. It holds no credential.
 */
final readonly class StartRequest
{
    public function __construct(
        public string $requestId,
        public string $agentId,
        public SelectedDriver $selection,
        public StartOriginType $origin,
        public RecordIdentity|null $ownerWork,
        public string|null $contextReference,
        public ConversationModeType $conversationMode,
        public string|null $parentSessionId,
        public StartPolicy $policy,
        public DriverType $driverType,
        public string|null $conversationTarget = null,
        public ChosenAccount|null $chosenAccount = null,
        public bool $savesDriverType = false,
        // The catalogue revision the start was previewed at, when it was; the start refuses once it moved on.
        public int|null $previewRevision = null,
    ) {}

    /**
     * What the start needs of its driver beyond its profiles' requirements: a resume needs the exact conversation, and
     * a start that must run in a container needs a driver that can.
     *
     * @return list<DriverCapability>
     */
    public function neededCapabilities(): array
    {
        $needed = [];

        if ($this->conversationMode === ConversationModeType::Resume) {
            $needed[] = DriverCapability::ExactResume;
        }

        if ($this->execution()->mode === ExecutionModeType::RequiredContainer) {
            $needed[] = DriverCapability::RunContained;
        }

        return $needed;
    }

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
            $this->selection->driver,
            $this->selection->model,
            $requested->type->value,
            $requested->model,
            $source->driverSource->value,
            $source->profileKey,
            $source->profileRevision,
            $this->origin->value,
            $this->ownerWork?->reference(),
            $this->contextReference,
            $this->conversationMode->value,
            $this->parentSessionId,
            $this->policy->digest(),
            $this->conversationTarget,
            $this->driverType->value,
            $this->chosenAccount?->accountId,
            $this->chosenAccount?->reviewedSignIn,
            $this->savesDriverType,
        ], JSON_THROW_ON_ERROR));
    }
}
