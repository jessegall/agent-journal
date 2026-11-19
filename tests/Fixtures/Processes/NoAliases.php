<?php

declare(strict_types=1);

namespace Tests\Fixtures\Processes;

use App\Processes\Contracts\AliasResolver;
use App\Processes\Values\AliasLookup;

/**
 * An alias reader for unit tests without a database: no project has a saved alias.
 */
final readonly class NoAliases implements AliasResolver
{
    public function find(string $name, string $projectKey): AliasLookup
    {
        return AliasLookup::missing($name);
    }
}
