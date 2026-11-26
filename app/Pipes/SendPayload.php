<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Api\Contracts\Domains\ApiSender;
use App\Bus\Contracts\Pipe;
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
