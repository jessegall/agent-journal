<?php

declare(strict_types=1);

namespace App\Contracts;

interface ScriptKeywordProvider
{
    /**
     * @return list<ScriptKeywordDefinition>
     */
    public function scriptKeywords(): array;
}
