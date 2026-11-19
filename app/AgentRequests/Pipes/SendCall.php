<?php

declare(strict_types=1);

namespace App\AgentRequests\Pipes;

use App\AgentRequests\Contracts\CallSender;
use App\AgentRequests\Values\CallAnswer;
use App\AgentRequests\Values\CallToSend;
use App\Pipelines\Contracts\Pipe;

/**
 * Sends any declared call and keeps its typed answer.
 */
final readonly class SendCall implements Pipe
{
    public function __construct(private CallSender $sender) {}

    public function handle(CallToSend $send): CallAnswer
    {
        return new CallAnswer($this->sender->send($send->call), $send->oneLine);
    }
}
