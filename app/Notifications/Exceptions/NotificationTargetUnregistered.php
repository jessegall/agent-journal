<?php

declare(strict_types=1);

namespace App\Notifications\Exceptions;

use LogicException;

final class NotificationTargetUnregistered extends LogicException
{
    public static function forKey(string $key): self
    {
        return new self("No notification target resolver is registered for {$key}.");
    }

    public static function twice(string $key): self
    {
        return new self("A notification target resolver for {$key} is already registered.");
    }
}
