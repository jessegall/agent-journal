<?php

declare(strict_types=1);

namespace App\Core\Hooks;

use App\Core\Hooks\Programs\ProgramReply;
use RuntimeException;

/**
 * Leaves the hook transaction when the call was answered before, so anything this call changed is rolled back
 * and the recorded reply goes out instead.
 */
final class ReplayFound extends RuntimeException
{
    private function __construct(public readonly ProgramReply $reply)
    {
        parent::__construct('This hook call was answered before; its recorded reply is sent again.');
    }

    public static function withReply(ProgramReply $reply): self
    {
        return new self($reply);
    }
}
