<?php

declare(strict_types=1);

namespace App\Scripts\Contracts;

/**
 * Registers a domain's script keywords under their owner.
 */
interface ScriptKeywordRegistration
{
    public function registerOwned(string $owner, ScriptKeywordDefinition $keyword): void;
}
