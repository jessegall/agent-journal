<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Actors\Contracts\ActorAttention;
use App\Actors\Support\AttentionOrigin;
use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Events\Support\StateEventContext;
use App\Hooks\Events\Support\StateEventDispatch;
use App\Hooks\Models\PendingAgentMessage;
use App\Hooks\Stack\HookAnswer;

/**
 * Keeps authorized event context and idle hook messages, and hands them over in the next eligible hook.
 */
final readonly class AgentMessageDelivery
{
    public function __construct(private ActorAttention $attention) {}

    public function deliver(StackTarget $target, HookInput $input, HookAnswer $answer): HookAnswer
    {
        if ($answer->messages !== [] && $input->leavesAgentIdle($answer->decision->answerType())) {
            $this->keepAndWake($target, $input, $answer->messages);

            return $answer;
        }

        return $answer->withRemindersFirst(PendingAgentMessage::takeAllFor($target->actorIdentity()));
    }

    public function retainEvent(StackTarget $target, StateEventDispatch $dispatch, StateEventContext $context): void
    {
        $dispatch->checkTarget($target);

        if ($context->isEmpty()) {
            return;
        }

        $actor = $target->actorIdentity();
        $origin = AttentionOrigin::stateEvent($dispatch->id);
        PendingAgentMessage::keep($actor, $origin, $context->lines, $context->requestsAttention());

        if ($context->requestsAttention()) {
            $this->attention->request($actor, $origin);
        }
    }

    /**
     * @param  list<string>  $messages
     */
    private function keepAndWake(StackTarget $target, HookInput $input, array $messages): void
    {
        $agent = $target->actorIdentity();
        $origin = AttentionOrigin::agentMessages($input->identity()->hookId);

        foreach ($messages as $text) {
            PendingAgentMessage::keep($agent, $origin, [$text], requestsAttention: true);
        }

        $this->attention->request($agent, $origin);
    }
}
