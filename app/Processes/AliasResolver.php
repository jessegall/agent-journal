<?php

declare(strict_types=1);

namespace App\Processes;

use App\Actors\Contracts\AliasResolver as AliasResolverContract;
use App\Models\CommandRules\CommandAlias;
use App\Values\AliasLookup;
use PhpOption\Option;

/**
 * The named read of the command aliases Processes keeps.
 */
final readonly class AliasResolver implements AliasResolverContract
{
    public function exists(string $name): bool
    {
        return CommandAlias::query()->withName($name)->exists();
    }

    /**
     * @return Option<AliasLookup>
     */
    public function find(string $name): Option
    {
        return CommandAlias::query()->withName($name)->firstOption()
            ->map(fn (CommandAlias $alias) => $alias->lookup);
    }
}
