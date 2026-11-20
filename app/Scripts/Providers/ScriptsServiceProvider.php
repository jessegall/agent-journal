<?php

declare(strict_types=1);

namespace App\Scripts\Providers;

use App\Scripts\Contracts\ScriptKeywordRegistration;
use App\Scripts\Contracts\ScriptObjectRegistration;
use App\Scripts\Objects\WorkspaceObject;
use App\Scripts\Support\KeywordRegistry;
use App\Scripts\Support\ObjectRegistry;
use Illuminate\Support\ServiceProvider;

final class ScriptsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ObjectRegistry::class);
        $this->app->singleton(KeywordRegistry::class);
        $this->app->alias(ObjectRegistry::class, ScriptObjectRegistration::class);
        $this->app->alias(KeywordRegistry::class, ScriptKeywordRegistration::class);
    }

    public function boot(ObjectRegistry $objects): void
    {
        $objects->register(WorkspaceObject::class);
    }
}
