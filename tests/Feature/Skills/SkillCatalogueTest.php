<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Contracts\Skills\SkillResolver;
use App\Exceptions\SkillDeclarationInvalid;
use App\Resolvers\SkillCatalogue;
use App\Support\CanonicalRenderer;
use App\Support\ConditionTree;
use App\Support\CoreSkills;
use App\Support\DomainRegistry;
use App\Support\MarkdownParts;
use App\Support\SkillRegistry;
use App\Support\StoredSkillSource;
use App\Values\SkillKey;
use App\Values\SkillOwner;
use Tests\Fixtures\Modules\Cards\CardsDomain;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Fixtures\Skills\Guide\GuideSkill;
use Tests\Fixtures\Skills\Guide\RenamedGuideSkill;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The catalogue builds every declared skill per request, checks its key against its owner and every other key, and
 * renders it; the registry it reads holds class names only.
 */
final class SkillCatalogueTest extends TestCase
{
    use RefreshHookDatabase;

    private const string NOTES_SECTION = <<<'TEXT'
            ## Notes

            A note keeps what an agent learned while it works.

            TEXT;

    public function test_the_catalogue_lists_a_registered_module_skill_with_its_owner(): void
    {
        $domainClasses = DomainRegistry::installedClasses(base_path());
        $registry = SkillRegistry::of(
            DomainRegistry::from(
                [...$domainClasses, CardsDomain::class, NotesDomain::class],
            )->skillDeclarations(CoreSkills::owner()),
        );
        $entry = $this->catalogue($registry)->find(SkillKey::from('notes-writing'));

        $this->assertSame('Notes', $entry->owner);
        $this->assertSame('Notes', $entry->name);
        $this->assertStringContainsString(
            self::NOTES_SECTION,
            $entry->rendered->markdown,
        );
    }

    public function test_renaming_a_skill_class_keeps_its_key_and_digest(): void
    {
        $before = $this->catalogue(
            SkillRegistry::of([$this->guide('Guide', [GuideSkill::class])]),
        )->find(SkillKey::from('journal-guide'));
        $after = $this->catalogue(
            SkillRegistry::of([$this->guide('Guide', [RenamedGuideSkill::class])]),
        )->find(SkillKey::from('journal-guide'));

        $this->assertSame($before->rendered->digest, $after->rendered->digest);
        $this->assertCount(
            1,
            $this->catalogue(SkillRegistry::of([$this->guide('Guide', [RenamedGuideSkill::class])]))->all(),
        );
    }

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

    /**
     * @param  list<class-string<GuideSkill|RenamedGuideSkill>>  $skills
     */
    private function guide(string $name, array $skills): SkillOwner
    {
        return new SkillOwner($name, base_path('tests/Fixtures/Skills/Guide'), $skills, true);
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
