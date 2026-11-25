<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\AliasResolver as AliasResolverContract;
use App\Models\CommandRules\CommandAlias;
use App\Values\AliasLookup;

/**
 * The named read of the command aliases Processes keeps.
 */
final readonly class AliasResolver implements AliasResolverContract
{
    public function exists(string $name): bool
    {
        return CommandAlias::query()->withName($name)->exists();
    }

    public function find(string $name): AliasLookup
    {
        $alias = CommandAlias::query()->withName($name)->first();

        if ($alias === null) {
            return AliasLookup::missing($name);
        }

        return $alias->lookup;
    }
}
