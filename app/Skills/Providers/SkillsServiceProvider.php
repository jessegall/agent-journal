<?php

declare(strict_types=1);

namespace App\Skills\Providers;

use App\Domains\Support\DomainRegistry;
use App\Numbers\Support\NumberedModel;
use App\Numbers\Support\NumberedTypeRegistry;
use App\Skills\Console\SkillListCommand;
use App\Skills\Console\SkillPreviewCommand;
use App\Skills\Console\SkillShowCommand;
use App\Skills\Contracts\SkillReader;
use App\Skills\Contracts\SkillRenderer;
use App\Skills\Contracts\SkillSource;
use App\Skills\CoreSkills;
use App\Skills\Models\Skill;
use App\Skills\Readers\SkillCatalogue;
use App\Skills\Readers\SkillContextReader;
use App\Skills\Support\CanonicalRenderer;
use App\Skills\Support\ConditionRegistry;
use App\Skills\Support\ConditionTree;
use App\Skills\Support\EvaluationGuard;
use App\Skills\Support\SkillRegistry;
use App\Skills\Support\StoredSkillSource;
use App\Skills\Values\SkillContext;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

/**
 * Keeps one registry of skill owners and one of named condition types for the application's life, builds the checked
 * catalogue and the evaluation guard once per request, and registers the skill console reads.
 */
final class SkillsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(SkillRegistry::class, fn (Application $app) => SkillRegistry::of($app->make(DomainRegistry::class)->skillDeclarations(CoreSkills::owner())));
        $this->app->singleton(ConditionRegistry::class, fn (Application $app) => ConditionRegistry::of($app->make(DomainRegistry::class)->skillConditionDeclarations()));
        $this->app->scoped(EvaluationGuard::class);
        $this->app->scoped(SkillContextReader::class);
        $this->app->scoped(SkillContext::class, fn (Application $app) => $app->make(SkillContextReader::class)->current());
        $this->app->bind(SkillRenderer::class, CanonicalRenderer::class);
        $this->app->bind(SkillSource::class, StoredSkillSource::class);
        $this->app->scoped(SkillReader::class, fn (Application $app) => SkillCatalogue::build($app->make(SkillRegistry::class), $app, $app->make(SkillRenderer::class), $app->make(ConditionTree::class), $app->make(SkillSource::class)));
    }

    public function boot(NumberedTypeRegistry $numbers): void
    {
        $numbers->register(NumberedModel::global(Skill::class));

        if ($this->app->runningInConsole()) {
            $this->commands([SkillListCommand::class, SkillShowCommand::class, SkillPreviewCommand::class]);
        }
    }
}
