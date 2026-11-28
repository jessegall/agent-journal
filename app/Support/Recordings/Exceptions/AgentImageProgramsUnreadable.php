<?php

declare(strict_types=1);

namespace App\Support\Recordings\Exceptions;

use RuntimeException;

/**
 * The digest of the agent image's programs could not be read, so no recording can be judged stale or fresh.
 */
final class AgentImageProgramsUnreadable extends RuntimeException
{
    public static function because(string $error): self
    {
        return new self('scripts/agent-image-programs.sh failed: '.trim($error));
    }
}
