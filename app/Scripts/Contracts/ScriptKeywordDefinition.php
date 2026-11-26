<?php

declare(strict_types=1);

namespace App\Scripts\Contracts;

interface ScriptKeywordDefinition
{
    /**
     * The word that starts a statement of this keyword in a script.
     */
    public function token(): string;
}
