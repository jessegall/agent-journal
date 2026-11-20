<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Contracts\CommandRefusal;
use RuntimeException;

final class MessageMissing extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function forId(string $messageId): self
    {
        return new self("Message {$messageId} does not exist.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
