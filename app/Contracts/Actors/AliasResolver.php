<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Values\AliasLookup;

/**
 * Reads a project's saved command aliases by name.
 */
interface AliasResolver
{
    /**
     * The actor or record an alias names in the project, or why none answers to it.
     */
    public function find(string $name, string $projectKey): AliasLookup;
}
