<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Hooks\Support\AgentMessageDelivery;
use App\Hooks\Values\Answer\WalkedCall;
use App\Pipelines\Contracts\Pipe;
use Illuminate\Contracts\Container\Container;

/**
 * Keeps the states' messages of a call that leaves the agent idle, or hands the kept ones over in this answer. The
 * delivery wakes through the actor attention, which holds request state, so it is asked for per call.
 */
final readonly class DeliverMessages implements Pipe
{
    public function __construct(private Container $container) {}

    public function handle(WalkedCall $walked): WalkedCall
    {
        $call = $walked->call;
        $delivery = $this->container->make(AgentMessageDelivery::class);

        return $walked->answeredBy($delivery->deliver($call->target, $call->input, $walked->answer));
    }
}
