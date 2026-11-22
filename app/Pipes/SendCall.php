<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\CallSender;
use App\Contracts\Pipe;
use App\Values\CallAnswer;
use App\Values\CallToSend;

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
