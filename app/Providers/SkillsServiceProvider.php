<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\Authorization\FileAccessPolicy as FileAccessPolicyContract;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Reads\MarkdownParts as MarkdownPartsContract;
use App\Contracts\Skills\SkillPublisher as SkillPublisherContract;
use App\Contracts\Skills\SkillResolver;
use App\Enums\Agents\AccessType;
use App\Enums\Files\Place;
use App\Policies\SkillAuthoringPolicy;
use App\Policies\SkillPolicy;
use App\Resolvers\CatalogueOnFirstRead;
use App\Resolvers\SkillCatalogue;
use App\Resolvers\Support\SkillContextResolver;
use App\Resolvers\Support\SkillStatusResolver;
use App\Support\CanonicalRenderer;
use App\Support\ConditionTree;
use App\Support\FileAccessPolicy;
use App\Support\MarkdownParts;
use App\Support\ReadOnlyStretch;
use App\Support\SkillPublisher;
use App\Support\SkillRegistry;
use App\Support\SkillTables;
use App\Support\SkillTargets;
use App\Support\StoredSkillSource;
use App\Values\PolicyDefinition;
use App\Values\SkillContext;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Contracts\Config\Repository;
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
        $this->app->bind(MarkdownPartsContract::class, MarkdownParts::class);
        $this->app->scoped(ReadOnlyStretch::class);
        $this->app->scoped(SkillContextResolver::class);
        $this->app->scoped(SkillStatusResolver::class);

        $this->app->scoped(
            SkillContext::class,
            fn (Application $app) => $app->make(SkillContextResolver::class)->current(),
        );

        $this->app->singleton(
            SkillTargets::class,
            fn () => new SkillTargets($this->app->make(Repository::class)->string(Place::HostSkills->rootSetting())),
        );

        $this->app->bind(SkillPublisherContract::class, SkillPublisher::class);
        $this->app->scoped(FileAccessPolicyContract::class, FileAccessPolicy::class);

        $this->app->bind(SkillTables::class, fn (Application $app) => new SkillTables(
            $app->make(DatabaseManager::class)->connection()->getSchemaBuilder(),
            [
                'skills',
                'skill_revisions',
                'skill_requests',
                'skill_generations',
                'skill_publications',
            ],
        ));

        $this->app->scoped(SkillResolver::class, fn (Application $app) => new CatalogueOnFirstRead(
            fn () => SkillCatalogue::build(
                $app->make(SkillRegistry::class),
                $app,
                $app->make(CanonicalRenderer::class),
                $app->make(ConditionTree::class),
                $app->make(StoredSkillSource::class),
            ),
        ));
    }

    public function boot(PolicyCatalogue $policies): void
    {
        $policies->register('Core', new PolicyDefinition(
            SkillPolicy::class,
            [AccessType::Read],
        ));

        $policies->register('Core', new PolicyDefinition(
            SkillAuthoringPolicy::class,
            [
                AccessType::Create,
                AccessType::Edit,
            ],
        ));

        $this->callAfterResolving(Schedule::class, function (Schedule $schedule): void {
            $schedule->command('skill:resume')->everyMinute()->withoutOverlapping();
            $schedule->command('skill:prune')->daily();
        });
    }
}
