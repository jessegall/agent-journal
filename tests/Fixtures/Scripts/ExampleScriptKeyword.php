<?php

declare(strict_types=1);

namespace Tests\Fixtures\Scripts;

use App\Scripts\Contracts\ScriptKeywordDefinition;

final readonly class ExampleScriptKeyword implements ScriptKeywordDefinition
{
    public function token(): string
    {
        return 'NOTE';
    }
}
