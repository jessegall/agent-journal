<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\StartOriginType;
use App\Agents\Models\ProgramConversation;
use App\Records\Support\RecordIdentity;

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
        public SelectedProgram $selection,
        public ConversationModeType $conversationMode,
        public StartPolicy $policy,
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
            $authorizedSource,
            $this->conversationMode === ConversationModeType::Resume
                ? ProgramConversation::lastUnder($this->agent->id, $this->contextReference, $this->selection->program)
                : null,
        );
    }
}
