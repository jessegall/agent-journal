<?php

declare(strict_types=1);

namespace App\Core\Agents;

use RuntimeException;

final class LaunchRefused extends RuntimeException
{
    public static function withoutHooks(string $program): self
    {
        return new self("No domain supplies hooks for {$program}, so it cannot be launched under the journal.");
    }
}
