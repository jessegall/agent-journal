<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Bus\Pipe;
use App\Contracts\Domains\ApiSender;
use App\Values\ApiAnswer;
use App\Values\PendingPayload;

/**
 * Sends any declared call and keeps its typed answer.
 */
final readonly class SendPayload implements Pipe
{
    public function __construct(private ApiSender $sender) {}

    public function handle(PendingPayload $send): ApiAnswer
    {
        return new ApiAnswer($this->sender->send($send->call), $send->isOneLine);
    }
}
