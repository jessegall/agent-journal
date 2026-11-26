<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use App\Agents\Drivers\Hooks\DriverReply;
use RuntimeException;

/**
 * Leaves the hook transaction when the call was answered before, so anything this call changed is rolled back
 * and the recorded reply it carries goes out instead.
 */
final class ReplayFound extends RuntimeException
{
    private function __construct(string $message, public readonly DriverReply $reply)
    {
        parent::__construct($message);
    }

    public static function answeredBefore(string $hookId, DriverReply $reply): self
    {
        return new self("The hook call {$hookId} was answered before; its recorded reply is sent again.", $reply);
    }
}
