<?php

declare(strict_types=1);

namespace App\Pipes\Answer;

use App\Contracts\Bus\Pipe;
use App\Support\AgentMessageDelivery;
use App\Support\CallStages\WalkedCall;

/**
 * Keeps the states' messages of a call that leaves the agent idle, or hands the kept ones over in this answer. The
 * delivery wakes through the actor attention, which holds request state, so it is asked for per call.
 */
final readonly class DeliverMessages implements Pipe
{
    public function __construct(private AgentMessageDelivery $delivery) {}

    public function handle(WalkedCall $walked): WalkedCall
    {
        $call = $walked->call;

        return $walked->answeredBy($this->delivery->deliver($call->target, $call->input, $walked->answer));
    }
}
