<?php

declare(strict_types=1);

namespace App\Core\Agents\Exceptions;

use RuntimeException;
use Throwable;

/**
 * A signed call from a launched program that got no answer it can use. The message names what happened and never
 * the launch token.
 */
final class AgentRequestFailed extends RuntimeException
{
    public static function unreachable(string $journalUrl, Throwable $previous): self
    {
        return new self("The journal at {$journalUrl} did not answer.", 0, $previous);
    }

    public static function refused(int $status, string $reason): self
    {
        return new self("The journal refused the call ({$status}): {$reason}");
    }
}
