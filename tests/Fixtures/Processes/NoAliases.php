<?php

declare(strict_types=1);

namespace Tests\Fixtures\Processes;

use App\Actors\Contracts\AliasResolver;
use App\Values\AliasLookup;
use PhpOption\None;
use PhpOption\Option;

/**
 * An alias reader for unit tests without a database: no project has a saved alias.
 */
final readonly class NoAliases implements AliasResolver
{
    /**
     * @return Option<AliasLookup>
     */
    public function find(string $name): Option
    {
        return None::create();
    }
}
