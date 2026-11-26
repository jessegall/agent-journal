<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\Contracts\FileAccessPolicy as FileAccessPolicyContract;
use App\Access\Contracts\PolicyCatalogue;
use App\Access\Values\PolicyDefinition;
use App\Agents\Enums\AccessType;
use App\Policies\SkillAuthoringPolicy;
use App\Policies\SkillPolicy;
use App\Reads\Contracts\MarkdownParts as MarkdownPartsContract;
use App\Reads\ReadOnlyStretch;
use App\Resolvers\CatalogueOnFirstRead;
use App\Resolvers\Support\SkillStatusResolver;
use App\Skills\CanonicalRenderer;
use App\Skills\ConditionTree;
use App\Skills\Contracts\SkillResolver;
use App\Skills\FileAccessPolicy;
use App\Skills\MarkdownParts;
use App\Skills\Resolvers\SkillCatalogue;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\SkillRegistry;
use App\Skills\SkillTables;
use App\Skills\StoredSkillSource;
use App\Skills\Values\SkillContext;
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

        $this->app->scoped(FileAccessPolicyContract::class, FileAccessPolicy::class);

        $this->app->bind(SkillTables::class, fn (Application $app) => new SkillTables(
            $app->make(DatabaseManager::class)->connection()->getSchemaBuilder(),
            ['skills', 'skill_revisions', 'skill_requests', 'skill_generations'],
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
            [AccessType::Create, AccessType::Edit],
        ));
    }
}
