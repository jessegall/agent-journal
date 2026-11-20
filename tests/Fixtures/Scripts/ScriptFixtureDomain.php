<?php

declare(strict_types=1);

namespace Tests\Fixtures\Scripts;

use App\Domains\Contracts\ProvidesScriptKeywords;
use App\Domains\Contracts\ProvidesScriptObjects;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;

final class ScriptFixtureDomain extends Domain implements ProvidesScriptKeywords, ProvidesScriptObjects
{
    public function description(): string
    {
        return 'Script definitions for testing';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()->build();
    }

    public function scriptObjects(): array
    {
        return [ExampleScriptObject::class];
    }

    public function scriptKeywords(): array
    {
        return [new ExampleScriptKeyword()];
    }
}
