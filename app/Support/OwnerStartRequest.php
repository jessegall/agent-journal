<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\ConversationModeType;
use App\Enums\DriverType;
use App\Enums\ExecutionModeType;
use App\Enums\StartOriginType;
use App\Models\Drivers\DriverConversation;
use App\Values\SelectedDriver;
use App\Values\StartPolicy;
use App\Values\StartRequest;

/**
 * An owner's request to start an agent for work it holds: the agent's actor, the record of the work and its context,
 * the frozen selection and policy and whether the conversation resumes. Core finds the calling session itself.
 */
final readonly class OwnerStartRequest
{
    public function __construct(
        public string $requestId,
        public ActorIdentity $agent,
        public RecordIdentity $work,
        public string $contextReference,
        public SelectedDriver $selection,
        public ConversationModeType $conversationMode,
        public StartPolicy $policy,
        // The driver type named for this start, none to take the agent's saved one or its profile's.
        public DriverType|null $driverType = null,
    ) {}

    public function executionMode(): ExecutionModeType
    {
        return $this->policy->execution->mode;
    }

    public function startRequest(
        string|null $parentSessionId,
        DriverType $driverType,
        RecordIdentity|null $authorizedSource = null,
    ): StartRequest {
        return new StartRequest(
            $this->requestId,
            $this->agent->id,
            $this->selection,
            StartOriginType::OwnerRequest,
            $this->work,
            $this->contextReference,
            $this->conversationMode,
            $parentSessionId,
            $this->policy,
            $driverType,
            authorizedSource: $authorizedSource,
            conversationTarget: $this->conversationMode === ConversationModeType::Resume
                ? DriverConversation::lastUnder($this->agent->id, $this->contextReference, $this->selection->driver)
                : null,
        );
    }
}
