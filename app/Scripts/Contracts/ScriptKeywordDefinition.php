<?php

declare(strict_types=1);

namespace App\Scripts\Contracts;

interface ScriptKeywordDefinition
{
    public function token(): string;
}
