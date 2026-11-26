<?php

declare(strict_types=1);

namespace App\Scripts\Contracts;

interface ScriptKeywordProvider
{
    /**
     * @return list<ScriptKeywordDefinition>
     */
    public function scriptKeywords(): array;
}
