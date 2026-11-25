<?php

declare(strict_types=1);

namespace App\Pipes\Answer;

use App\Contracts\Actors\ActorAttention;
use App\Contracts\Bus\Pipe;
use App\Models\Agents\PendingAgentMessage;
use App\Support\AttentionOrigin;
use App\Support\CallStages\WalkedCall;

/**
 * Keeps the messages of an answer that leaves its agent idle for the agent's next turn, and wakes the agent for them.
 */
final readonly class KeepMessagesAndWake implements Pipe
{
    public function __construct(private ActorAttention $attention) {}

    public function handle(WalkedCall $walked): WalkedCall
    {
        $agent = $walked->call->target->actorIdentity();
        $origin = AttentionOrigin::agentMessages($walked->call->input->identity()->hookId);

        PendingAgentMessage::create($agent, $origin, $walked->answer->messages);

        $this->attention->request($agent, $origin);

        return $walked;
    }
}
