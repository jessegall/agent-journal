<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Models\CommandAlias;

/**
 * The named read of the command aliases Processes keeps.
 */
final readonly class CommandAliases
{
    public function exists(string $name): bool
    {
        return CommandAlias::query()->where('name', $name)->exists();
    }
}
