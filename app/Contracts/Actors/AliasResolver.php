<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Values\AliasLookup;

/**
 * Reads the selected project's saved command aliases by name.
 */
interface AliasResolver
{
    /**
     * The alias of this name in the selected project, or why none answers to it.
     */
    public function find(string $name): AliasLookup;
}
