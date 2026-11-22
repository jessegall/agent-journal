<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A notification the actor holds no receipt of: missing and someone else's answer alike, so it names nothing.
 */
final class NotificationUnavailable extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function create(): self
    {
        return new self('This notification is unavailable.');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
