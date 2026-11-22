<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Contracts\Skills\SkillResolver;
use App\Support\CoreSkills;
use App\Support\DomainRegistry;
use App\Support\SkillRegistry;
use App\Values\SkillKey;
use App\Values\SkillOwner;
use Illuminate\Support\Facades\Artisan;
use Tests\Fixtures\Modules\Cards\CardsDomain;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Fixtures\Skills\Guide\GuideSkill;
use Tests\Fixtures\Skills\Guide\RenamedGuideSkill;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * skill:list and skill:show read only the catalogue: the list names every skill, show prints the rendered bytes, and a
 * catalogue that cannot be built answers with its reason instead of a partial list.
 */
final class SkillAuthoringTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_list_names_the_module_skill_and_every_shipped_skill(): void
    {
        $this->useOwners(...$this->installedOwners());

        $this->artisan('skill:list')->expectsOutputToContain('notes-writing')->assertSuccessful();

        Artisan::call('skill:list', ['--json' => true]);
        $listed = array_column(json_decode(Artisan::output(), true, flags: JSON_THROW_ON_ERROR), 'key');
        $catalogued = array_map(fn ($skill) => $skill->key->key, $this->app->make(SkillResolver::class)->all());

        $this->assertSame($catalogued, $listed);
        $this->assertContains('notes-writing', $listed);
    }

    public function test_show_prints_the_bytes_the_renderer_produced(): void
    {
        $this->useOwners(...$this->installedOwners());
        $rendered = $this->app->make(SkillResolver::class)->find(SkillKey::from('notes-writing'))->rendered->markdown;

        Artisan::call('skill:show', ['key' => 'notes-writing']);

        $this->assertSame($rendered, Artisan::output());
    }

    public function test_an_unknown_key_is_not_found(): void
    {
        $this->artisan(
            'skill:show',
            ['key' => 'journal-nothing'],
        )->expectsOutputToContain('There is no skill journal-nothing.')->assertFailed();
    }

    public function test_a_catalogue_that_cannot_be_built_prints_its_reason(): void
    {
        $root = base_path('tests/Fixtures/Skills/Guide');
        $this->useOwners(
            new SkillOwner('Guide', $root, [GuideSkill::class], true),
            new SkillOwner('Copy', $root, [RenamedGuideSkill::class], true),
        );

        $this->artisan('skill:list')
            ->expectsOutputToContain('Guide and Copy both declare the skill key journal-guide')
            ->assertFailed();
    }

    /**
     * @return list<SkillOwner>
     */
    private function installedOwners(): array
    {
        $domainClasses = DomainRegistry::installedClasses(base_path());

        return DomainRegistry::from(
            [...$domainClasses, CardsDomain::class, NotesDomain::class],
        )->skillDeclarations(CoreSkills::owner());
    }

    private function useOwners(SkillOwner ...$owners): void
    {
        $this->app->instance(SkillRegistry::class, SkillRegistry::of(array_values($owners)));
        $this->app->forgetScopedInstances();
    }
}
