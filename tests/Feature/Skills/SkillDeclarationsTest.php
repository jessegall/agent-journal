<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Domains\Exceptions\SkillDeclarationRefused;
use App\Domains\Support\DomainRegistry;
use App\Skills\Support\CoreSkills;
use App\Skills\Values\SkillOwner;
use Tests\Fixtures\Domains\FalseSkills\FalseSkillsDomain;
use Tests\Fixtures\Domains\StraySkills\StraySkillsDomain;
use Tests\Fixtures\Modules\Cards\CardsDomain;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Fixtures\Modules\Notes\Skills\NotesSkill;
use Tests\TestCase;

/**
 * Skills are declared like commands: Core first, then each domain or registered module through ProvidesSkills, with
 * every class checked when its owner is registered.
 */
final class SkillDeclarationsTest extends TestCase
{
    public function test_core_comes_first_and_a_domain_without_skills_contributes_none(): void
    {
        /** @var list<string> $domainClasses */
        $domainClasses = require base_path('bootstrap/domains.php');
        $owners = DomainRegistry::from($domainClasses)->skillDeclarations(CoreSkills::owner());

        $this->assertSame('Core', $owners[0]->name);
        $this->assertSame(base_path(), $owners[0]->sourceRoot);
        $documents = array_values(array_filter($owners, fn (SkillOwner $owner) => $owner->name === 'Documents'))[0];
        $this->assertSame(base_path('domain/Documents'), $documents->sourceRoot);
        $this->assertSame([], $documents->skills);
    }

    public function test_a_registered_module_contributes_its_skill_under_its_own_name(): void
    {
        /** @var list<string> $domainClasses */
        $domainClasses = require base_path('bootstrap/domains.php');
        $owners = DomainRegistry::from([...$domainClasses, CardsDomain::class, NotesDomain::class])->skillDeclarations(CoreSkills::owner());
        $notes = array_values(array_filter($owners, fn (SkillOwner $owner) => $owner->name === 'Notes'))[0];

        $this->assertSame([NotesSkill::class], $notes->skills);
        $this->assertSame(base_path('tests/Fixtures/Modules/Notes/resources/skills'), $notes->skillsFolder());
    }

    public function test_a_skill_outside_the_declaring_package_stops_registration_naming_domain_and_class(): void
    {
        $this->expectException(SkillDeclarationRefused::class);
        $this->expectExceptionMessage('StraySkills declares the skill '.NotesSkill::class);

        DomainRegistry::from([StraySkillsDomain::class]);
    }

    public function test_a_class_that_is_no_skill_stops_registration_naming_domain_and_class(): void
    {
        $this->expectException(SkillDeclarationRefused::class);
        $this->expectExceptionMessage('FalseSkills declares the skill '.FalseSkillsDomain::class.', but it does not implement');

        DomainRegistry::from([FalseSkillsDomain::class]);
    }
}
