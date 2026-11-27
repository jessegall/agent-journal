<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Values\AliasLookup;
use PhpOption\Option;

/**
 * Reads the selected project's saved command aliases by name.
 */
interface AliasResolver
{
    /**
     * The alias of this name in the selected project; none when no alias answers to it.
     *
     * @return Option<AliasLookup>
     */
    public function find(string $name): Option;
}
