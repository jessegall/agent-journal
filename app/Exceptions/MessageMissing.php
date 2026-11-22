<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
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
