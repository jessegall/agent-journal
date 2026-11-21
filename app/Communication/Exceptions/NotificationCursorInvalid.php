<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use RuntimeException;

/**
 * A notification cursor that is malformed or was issued for another scope.
 */
final class NotificationCursorInvalid extends RuntimeException implements CodedRefusal
{
    public static function create(): self
    {
        return new self('This notification cursor is not valid for you.');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
