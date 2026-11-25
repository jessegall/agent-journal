<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\AliasResolver;
use App\Models\CommandRules\CommandAlias;
use App\Values\AliasLookup;

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

        if ($alias === null) {
            return AliasLookup::missing($name);
        }

        return $alias->lookup;
    }
}
