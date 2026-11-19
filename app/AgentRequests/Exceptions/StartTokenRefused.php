<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

use RuntimeException;

/**
 * A start token the journal will not use: a value that is empty or still a placeholder, or a journal address
 * reached without HTTPS off this machine. The message never names the token.
 */
final class StartTokenRefused extends RuntimeException
{
    public static function placeholder(string $name): self
    {
        return new self("{$name} is empty or still a placeholder; the journal's start sets it.");
    }

    public static function insecureUrl(string $journalUrl): self
    {
        return new self("The journal at {$journalUrl} must be reached over HTTPS unless it runs on this machine.");
    }
}
