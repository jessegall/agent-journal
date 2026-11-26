<?php

declare(strict_types=1);

namespace App\Inboxes\Exceptions;

use RuntimeException;

final class InboxProviderInvalid extends RuntimeException
{
    public static function repeated(string $providerKey): self
    {
        return new self("The inbox provider key {$providerKey} is registered twice; register each provider once.");
    }

    public static function notAProvider(string $providerKey, string $class): self
    {
        return new self("{$class}, registered as inbox provider {$providerKey}, does not implement InboxProvider.");
    }

    public static function tooManyMembers(int $count): self
    {
        return new self("An inbox read {$count} members; an inbox holds at most 100.");
    }
}
