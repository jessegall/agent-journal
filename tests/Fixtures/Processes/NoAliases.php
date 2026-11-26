<?php

declare(strict_types=1);

namespace Tests\Fixtures\Processes;

use App\Actors\Contracts\AliasResolver;
use App\Values\AliasLookup;

/**
 * An alias reader for unit tests without a database: no project has a saved alias.
 */
final readonly class NoAliases implements AliasResolver
{
    public function find(string $name): AliasLookup
    {
        return AliasLookup::missing($name);
    }
}
