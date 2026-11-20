<?php

declare(strict_types=1);

namespace App\Domains\Bootstrappers;

use App\Domains\Contracts\DomainBootstrapper;
use App\Domains\Contracts\ScriptKeywordProvider;
use App\Domains\Contracts\ScriptObjectProvider;
use App\Domains\Support\DomainEntry;
use App\Scripts\Support\KeywordRegistry;
use App\Scripts\Support\ObjectRegistry;

final readonly class RegisterScriptDefinitions implements DomainBootstrapper
{
    public function __construct(private ObjectRegistry $objects, private KeywordRegistry $keywords) {}

    public function __invoke(DomainEntry $domain): void
    {
        $this->registerObjects($domain);
        $this->registerKeywords($domain);
    }

    private function registerObjects(DomainEntry $domain): void
    {
        if (! $domain->domain instanceof ScriptObjectProvider) {
            return;
        }

        foreach ($domain->domain->scriptObjects() as $class) {
            $this->objects->registerOwned($domain->name, $class);
        }
    }

    private function registerKeywords(DomainEntry $domain): void
    {
        if (! $domain->domain instanceof ScriptKeywordProvider) {
            return;
        }

        foreach ($domain->domain->scriptKeywords() as $keyword) {
            $this->keywords->registerOwned($domain->name, $keyword);
        }
    }
}
