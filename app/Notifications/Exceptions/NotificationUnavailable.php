<?php

declare(strict_types=1);

namespace App\Notifications\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
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
