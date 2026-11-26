<?php

declare(strict_types=1);

namespace App\Processes\Readers\Values;

use App\Scripts\Contracts\ScriptKeywordDefinition;

final readonly class RegisteredKeyword
{
    public function __construct(public ScriptKeywordDefinition $definition, public string $owner) {}
}
