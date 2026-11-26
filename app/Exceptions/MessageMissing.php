<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;
use Throwable;

final class MessageMissing extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function forId(string $messageId, Throwable|null $previous = null): self
    {
        return new self("Message {$messageId} does not exist.", previous: $previous);
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
