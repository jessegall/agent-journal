<?php

declare(strict_types=1);

namespace App\Core\Agents\Exceptions;

use RuntimeException;

final class LaunchSettingMissing extends RuntimeException
{
    public static function forName(string $name): self
    {
        return new self("A call to the journal needs {$name} in its environment; the journal's launch sets it.");
    }
}
