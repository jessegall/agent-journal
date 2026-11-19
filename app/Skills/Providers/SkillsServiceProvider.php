<?php

declare(strict_types=1);

namespace App\Skills\Providers;

use App\Numbers\Support\NumberedModel;
use App\Numbers\Support\NumberedTypeRegistry;
use App\Skills\Console\SkillCopyCommand;
use App\Skills\Console\SkillEditCommand;
use App\Skills\Console\SkillListCommand;
use App\Skills\Console\SkillMakeCommand;
use App\Skills\Console\SkillPreviewCommand;
use App\Skills\Console\SkillPruneCommand;
use App\Skills\Console\SkillRefreshCommand;
use App\Skills\Console\SkillRestoreCommand;
use App\Skills\Console\SkillResumeCommand;
use App\Skills\Console\SkillRetireCommand;
use App\Skills\Console\SkillRetryCommand;
use App\Skills\Console\SkillRevisionCommand;
use App\Skills\Console\SkillRevisionsCommand;
use App\Skills\Console\SkillShowCommand;
use App\Skills\Console\SkillStatusCommand;
use App\Skills\Contracts\SkillPublisher;
use App\Skills\Contracts\SkillRenderer;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Contracts\SkillSource;
use App\Skills\Models\Skill;
use App\Skills\Resolvers\CatalogueOnFirstRead;
use App\Skills\Resolvers\SkillCatalogue;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\Resolvers\Support\SkillStatusResolver;
use App\Skills\Support\CanonicalRenderer;
use App\Skills\Support\ConditionTree;
use App\Skills\Support\EvaluationGuard;
use App\Skills\Support\HostSkillPublisher;
use App\Skills\Support\SkillRegistry;
use App\Skills\Support\SkillTables;
use App\Skills\Support\SkillTargets;
use App\Skills\Support\StoredSkillSource;
use App\Skills\Values\SkillContext;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\ServiceProvider;

/**
 * Keeps one registry of skill owners and one of named condition types for the application's life, builds the checked
 * catalogue and the evaluation guard once per request, and registers the skill console reads.
 */
final class SkillsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(EvaluationGuard::class);
        $this->app->scoped(SkillContextResolver::class);
        $this->app->scoped(SkillStatusResolver::class);
        $this->app->scoped(
            SkillContext::class,
            fn (Application $app) => $app->make(SkillContextResolver::class)->current(),
        );
        $this->app->bind(SkillRenderer::class, CanonicalRenderer::class);
        $this->app->bind(SkillSource::class, StoredSkillSource::class);
        $this->app->singleton(SkillTargets::class, fn () => new SkillTargets(storage_path('app/skills')));
        $this->app->bind(SkillPublisher::class, HostSkillPublisher::class);
        $this->app->bind(SkillTables::class, fn (Application $app) => new SkillTables(
            $app->make(DatabaseManager::class)->connection()->getSchemaBuilder(),
            ['skills', 'skill_revisions', 'skill_requests', 'skill_generations', 'skill_publications'],
        ));
        $this->app->scoped(SkillResolver::class, fn (Application $app) => new CatalogueOnFirstRead(
            fn () => SkillCatalogue::build(
                $app->make(SkillRegistry::class),
                $app,
                $app->make(SkillRenderer::class),
                $app->make(ConditionTree::class),
                $app->make(SkillSource::class),
            ),
        ));
    }

    public function boot(NumberedTypeRegistry $numbers): void
    {
        $numbers->register(NumberedModel::global(Skill::class));

        $this->callAfterResolving(Schedule::class, function (Schedule $schedule): void {
            $schedule->command('skill:resume')->everyMinute()->withoutOverlapping();
            $schedule->command('skill:prune')->daily();
        });

        if ($this->app->runningInConsole()) {
            $this->commands([
                SkillListCommand::class,
                SkillShowCommand::class,
                SkillPreviewCommand::class,
                SkillMakeCommand::class,
                SkillEditCommand::class,
                SkillRestoreCommand::class,
                SkillRetireCommand::class,
                SkillCopyCommand::class,
                SkillRevisionsCommand::class,
                SkillRevisionCommand::class,
                SkillRefreshCommand::class,
                SkillResumeCommand::class,
                SkillRetryCommand::class,
                SkillPruneCommand::class,
                SkillStatusCommand::class,
            ]);
        }
    }
}
