<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Actors\Contracts\ActorAttention;
use App\Actors\Support\AttentionOrigin;
use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Models\PendingAgentMessage;
use App\Hooks\Stack\HookAnswer;

/**
 * Brings the states' messages to their agent inside the hook transaction. A hook that leaves the agent idle keeps its
 * messages for the next hook and wakes the agent's runtime once; any other hook hands the kept ones over, first in its
 * context, beside its own.
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

    /**
     * @param  list<string>  $messages
     */
    private function keepAndWake(StackTarget $target, HookInput $input, array $messages): void
    {
        $agent = $target->actorIdentity();
        $hookId = $input->identity()->hookId;

        foreach ($messages as $text) {
            PendingAgentMessage::keep($agent, $hookId, $text);
        }

        $this->attention->request($agent, AttentionOrigin::agentMessages($hookId));
    }
}
