<?php

declare(strict_types=1);

namespace App\Skills\Providers;

use App\Domains\Support\DomainRegistry;
use App\Skills\Console\SkillListCommand;
use App\Skills\Console\SkillShowCommand;
use App\Skills\Contracts\SkillReader;
use App\Skills\Contracts\SkillRenderer;
use App\Skills\CoreSkills;
use App\Skills\Readers\SkillCatalogue;
use App\Skills\Support\CanonicalRenderer;
use App\Skills\Support\SkillRegistry;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

/**
 * Keeps one registry of skill owners for the application's life, builds the checked catalogue once per request and
 * registers the skill console reads.
 */
final class SkillsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(SkillRegistry::class, fn (Application $app) => SkillRegistry::of($app->make(DomainRegistry::class)->skillDeclarations(CoreSkills::owner())));
        $this->app->bind(SkillRenderer::class, CanonicalRenderer::class);
        $this->app->scoped(SkillReader::class, fn (Application $app) => SkillCatalogue::build($app->make(SkillRegistry::class), $app, $app->make(SkillRenderer::class)));
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([SkillListCommand::class, SkillShowCommand::class]);
        }
    }
}
