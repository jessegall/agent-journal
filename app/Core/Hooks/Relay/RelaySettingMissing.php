<?php

declare(strict_types=1);

namespace App\Core\Hooks\Relay;

use RuntimeException;

final class RelaySettingMissing extends RuntimeException
{
    public static function forName(string $name): self
    {
        return new self("The hook relay needs {$name} in its environment; the journal's launch sets it.");
    }
}
