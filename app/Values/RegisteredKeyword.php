<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Scripts\ScriptKeywordDefinition;

final readonly class RegisteredKeyword
{
    public function __construct(public ScriptKeywordDefinition $definition, public string $owner) {}
}
