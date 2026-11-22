<?php

declare(strict_types=1);

namespace App\Support\Bootstrappers;

use App\Contracts\Domains\DomainBootstrapper;
use App\Contracts\Scripts\ScriptKeywordProvider;
use App\Contracts\Scripts\ScriptKeywordRegistration;
use App\Contracts\Scripts\ScriptObjectProvider;
use App\Contracts\Scripts\ScriptObjectRegistration;
use App\Support\DomainEntry;

final readonly class RegisterScriptDefinitions implements DomainBootstrapper
{
    public function __construct(
        private ScriptObjectRegistration $objects,
        private ScriptKeywordRegistration $keywords,
    ) {}

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
