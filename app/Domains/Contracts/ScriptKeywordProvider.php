<?php

declare(strict_types=1);

namespace App\Domains\Contracts;

use App\Scripts\Contracts\ScriptKeywordDefinition;

interface ScriptKeywordProvider
{
    /**
     * @return list<ScriptKeywordDefinition>
     */
    public function scriptKeywords(): array;
}
