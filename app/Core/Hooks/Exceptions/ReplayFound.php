<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use RuntimeException;

/**
 * Leaves the hook transaction when the call was answered before, so anything this call changed is rolled back
 * and the recorded reply goes out instead.
 */
final class ReplayFound extends RuntimeException
{
    public static function answeredBefore(string $hookId): self
    {
        return new self("The hook call {$hookId} was answered before; its recorded reply is sent again.");
    }
}
