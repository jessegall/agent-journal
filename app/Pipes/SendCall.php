<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Bus\Pipe;
use App\Contracts\Domains\CallSender;
use App\Values\CallAnswer;
use App\Values\PendingCall;

/**
 * Sends any declared call and keeps its typed answer.
 */
final readonly class SendCall implements Pipe
{
    public function __construct(private CallSender $sender) {}

    public function handle(PendingCall $send): CallAnswer
    {
        return new CallAnswer($this->sender->send($send->call), $send->oneLine);
    }
}
