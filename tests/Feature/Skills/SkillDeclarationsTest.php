<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Contracts\Skill;
use App\Exceptions\SkillDeclarationRefused;
use App\Support\CoreSkills;
use App\Support\DomainRegistry;
use App\Values\SkillOwner;
use Tests\Fixtures\Domains\FalseSkills\FalseSkillsDomain;
use Tests\Fixtures\Domains\StraySkills\StraySkillsDomain;
use Tests\Fixtures\Modules\Cards\CardsDomain;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Fixtures\Modules\Notes\Skills\NotesSkill;
use Tests\TestCase;

/**
 * Skills are declared like commands: Core first, then each domain or registered module through SkillProvider, with
 * every class checked when its owner is registered.
 */
final class SkillDeclarationsTest extends TestCase
{
    private const string OUTSIDE_PACKAGE = "it lies outside the domain's own package";

    public function test_core_comes_first_and_a_domain_without_skills_contributes_none(): void
    {
        $domainClasses = DomainRegistry::installedClasses(base_path());
        $owners = DomainRegistry::from($domainClasses)->skillDeclarations(CoreSkills::owner());

        $this->assertSame('Core', $owners[0]->name);
        $this->assertSame(base_path(), $owners[0]->sourceRoot);
        $documents = array_values(array_filter($owners, fn (SkillOwner $owner) => $owner->name === 'Documents'))[0];
        $this->assertSame(base_path('domain/Documents'), $documents->sourceRoot);
        $this->assertSame([], $documents->skills);
    }

    public function test_a_registered_module_contributes_its_skill_under_its_own_name(): void
    {
        $domainClasses = DomainRegistry::installedClasses(base_path());
        $owners = DomainRegistry::from(
            [...$domainClasses, CardsDomain::class, NotesDomain::class],
        )->skillDeclarations(CoreSkills::owner());
        $notes = array_values(array_filter($owners, fn (SkillOwner $owner) => $owner->name === 'Notes'))[0];

        $this->assertSame([NotesSkill::class], $notes->skills);
        $this->assertSame(base_path('tests/Fixtures/Modules/Notes/resources/skills'), $notes->skillsFolder());
    }

    public function test_a_skill_outside_the_declaring_package_stops_registration_naming_domain_and_class(): void
    {
        $this->expectException(SkillDeclarationRefused::class);
        $this->expectExceptionMessage(
            SkillDeclarationRefused::for('StraySkills', NotesSkill::class, self::OUTSIDE_PACKAGE)->getMessage(),
        );

        DomainRegistry::from([StraySkillsDomain::class]);
    }

    public function test_a_class_that_is_no_skill_stops_registration_naming_domain_and_class(): void
    {
        $this->expectException(SkillDeclarationRefused::class);
        $this->expectExceptionMessage(
            SkillDeclarationRefused::for('FalseSkills', FalseSkillsDomain::class, 'it does not implement '.Skill::class)
                ->getMessage(),
        );

        DomainRegistry::from([FalseSkillsDomain::class]);
    }
}
