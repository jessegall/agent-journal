<?php

declare(strict_types=1);

namespace App\Support\Recordings\Exceptions;

use RuntimeException;

/**
 * The digest of the agent image's build could not be read, so no recording can be judged stale or fresh.
 */
final class AgentImageBuildUnreadable extends RuntimeException
{
    public static function because(string $script, string $error): self
    {
        return new self("{$script} failed: ".trim($error));
    }
}
