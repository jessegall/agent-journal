<?php

declare(strict_types=1);

namespace App\Core\Hooks;

use RuntimeException;

/**
 * A retry of a recorded hook call whose input differs from the first one, so it is not the same call.
 */
final class HookDigestChanged extends RuntimeException
{
    public static function forCall(string $hookId): self
    {
        return new self("The hook call {$hookId} was recorded with other input; a retry must send the same input.");
    }
}
