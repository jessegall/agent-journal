<?php

declare(strict_types=1);

namespace App\Contracts\Scripts;

interface ScriptKeywordDefinition
{
    public function token(): string;
}
