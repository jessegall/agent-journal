<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

use RuntimeException;

final class StartSettingMissing extends RuntimeException
{
    public static function forName(string $name): self
    {
        return new self("A call to the journal needs {$name} in its environment; the journal's start sets it.");
    }
}
