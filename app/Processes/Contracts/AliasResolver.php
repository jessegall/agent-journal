<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Values\AliasLookup;

/**
 * Reads a project's saved command aliases by name.
 */
interface AliasResolver
{
    public function find(string $name, string $projectKey): AliasLookup;
}
