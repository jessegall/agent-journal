<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Contracts\Skills\SkillResolver;
use App\Exceptions\SkillDeclarationInvalid;
use App\Resolvers\SkillCatalogue;
use App\Support\CanonicalRenderer;
use App\Support\ConditionTree;
use App\Support\MarkdownParts;
use App\Support\SkillRegistry;
use App\Support\StoredSkillSource;
use App\Values\SkillOwner;
use Tests\Fixtures\Skills\Guide\GuideSkill;
use Tests\TestCase;

/**
 * The catalogue builds every declared skill per request, checks its key against its owner and every other key, and
 * renders it; the registry it reads holds class names only.
 */
final class SkillCatalogueTest extends TestCase
{
    public function test_a_module_may_not_declare_a_journal_key(): void
    {
        $this->expectException(SkillDeclarationInvalid::class);
        $this->expectExceptionMessage(SkillDeclarationInvalid::reservedKey('Guide', 'journal-guide')->getMessage());

        $this->catalogue(
            SkillRegistry::of(
                [new SkillOwner('Guide', base_path('tests/Fixtures/Skills/Guide'), [GuideSkill::class], false)],
            ),
        );
    }

    public function test_each_request_scope_builds_its_own_catalogue(): void
    {
        $first = $this->app->make(SkillResolver::class);
        $this->assertSame($first, $this->app->make(SkillResolver::class));

        $this->app->forgetScopedInstances();

        $this->assertNotSame($first, $this->app->make(SkillResolver::class));
    }

    private function catalogue(SkillRegistry $registry): SkillCatalogue
    {
        return SkillCatalogue::build(
            $registry,
            $this->app,
            new CanonicalRenderer($this->app->make(MarkdownParts::class)),
            $this->app->make(ConditionTree::class),
            $this->app->make(StoredSkillSource::class),
        );
    }
}
