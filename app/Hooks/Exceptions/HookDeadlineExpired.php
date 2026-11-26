<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use RuntimeException;

/**
 * A hook call whose time ran out before the journal could take the stack lock.
 */
final class HookDeadlineExpired extends RuntimeException
{
    public static function forCall(string $hookId): self
    {
        return new self("The hook call {$hookId} has no time left to be answered.");
    }
}
