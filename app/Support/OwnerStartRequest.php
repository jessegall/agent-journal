<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\ConversationModeType;
use App\Enums\DriverVariant;
use App\Enums\ExecutionModeType;
use App\Enums\StartOriginType;
use App\Models\DriverConversation;
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
        // The mode named for this start, none to take the agent's saved one or its profile's.
        public DriverVariant|null $mode = null,
    ) {}

    public function executionMode(): ExecutionModeType
    {
        return $this->policy->execution->mode;
    }

    public static function ownerReferenceOf(RecordIdentity $work): string
    {
        return sprintf('%s:%s', $work->type, $work->id);
    }

    public function startRequest(
        string|null $parentSessionId,
        DriverVariant $variant,
        RecordIdentity|null $authorizedSource = null,
    ): StartRequest {
        return new StartRequest(
            $this->requestId,
            $this->agent->id,
            $this->selection,
            StartOriginType::OwnerRequest,
            self::ownerReferenceOf($this->work),
            $this->contextReference,
            $this->conversationMode,
            $parentSessionId,
            $this->policy,
            $variant,
            authorizedSource: $authorizedSource,
            conversationTarget: $this->conversationMode === ConversationModeType::Resume
                ? DriverConversation::lastUnder($this->agent->id, $this->contextReference, $this->selection->driver)
                : null,
        );
    }
}
