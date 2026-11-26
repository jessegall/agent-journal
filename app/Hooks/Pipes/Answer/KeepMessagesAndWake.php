<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Actors\AttentionOrigin;
use App\Actors\Contracts\ActorAttention;
use App\Bus\Contracts\Pipe;
use App\Hooks\CallStages\WalkedCall;
use App\Models\Agents\PendingAgentMessage;

/**
 * Keeps the messages of an answer that leaves its agent idle for the agent's next turn, and wakes the agent for them.
 */
final readonly class KeepMessagesAndWake implements Pipe
{
    public function __construct(private ActorAttention $attention) {}

    public function handle(WalkedCall $walked): WalkedCall
    {
        $agent = $walked->call->target->actorReference();
        $origin = AttentionOrigin::agentMessages($walked->call->input->identity()->hookId);

        PendingAgentMessage::createMany($agent, $origin, $walked->answer->messages);

        $this->attention->request($agent, $origin);

        return $walked;
    }
}
