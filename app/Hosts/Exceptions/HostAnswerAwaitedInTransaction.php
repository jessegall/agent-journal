<?php

declare(strict_types=1);

namespace App\Hosts\Exceptions;

use RuntimeException;

/**
 * A host's answer was awaited inside a transaction, where the order it answers is not yet committed for the host to
 * claim, so the wait could only time out.
 */
final class HostAnswerAwaitedInTransaction extends RuntimeException
{
    public static function atLevel(string $orderId, int $level): self
    {
        return new self("The answer to order {$orderId} is awaited outside every transaction, but {$level} were open.");
    }
}
