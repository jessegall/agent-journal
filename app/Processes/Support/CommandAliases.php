<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Contracts\AliasResolver;
use App\Processes\Models\CommandAlias;
use App\Processes\Values\AliasLookup;

/**
 * The named read of the command aliases Processes keeps.
 */
final readonly class CommandAliases implements AliasResolver
{
    public function exists(string $name): bool
    {
        return CommandAlias::query()->where('name', $name)->exists();
    }

    public function find(string $name, string $projectKey): AliasLookup
    {
        $alias = CommandAlias::query()->named($name, $projectKey)->first();

        return $alias === null
            ? AliasLookup::missing($name)
            : $alias->lookup();
    }
}
