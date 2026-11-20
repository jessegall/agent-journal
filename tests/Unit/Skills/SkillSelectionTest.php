<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\Profiles\Support\BuiltInAuthorizations;
use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileSnapshot;
use App\Programs\Values\ProgramKey;
use App\Programs\Values\ProviderKey;
use App\Skills\Conditions\Conditions;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Enums\SkillOrigin;
use App\Skills\Exceptions\SkillSelectionConflict;
use App\Skills\Support\SkillSelection;
use App\Skills\Values\RenderedSkill;
use App\Skills\Values\SkillContext;
use App\Skills\Values\SkillEntry;
use App\Skills\Values\SkillKey;
use App\Skills\Values\StartProfile;
use Tests\Fixtures\Profiles\TestStartPolicies;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A selection holds only matching skills, narrowed by the profile's allowlist; required skills must be among them,
 * and no profile setting selects a skill its condition excludes.
 */
final class SkillSelectionTest extends TestCase
{
    public function test_an_absent_allowlist_selects_every_match(): void
    {
        $selection = new SkillSelection()->select($this->skills(), $this->helper(null, []));

        $this->assertSame(['journal', 'journal-review'], $selection->selectedKeys());
        $this->assertSame('no_match:grant-not-held', $selection->excluded[0]->reason);
    }

    public function test_an_empty_allowlist_selects_none(): void
    {
        $selection = new SkillSelection()->select($this->skills(), $this->helper([], []));

        $this->assertSame([], $selection->selectedKeys());
        $this->assertCount(3, $selection->excluded);
    }

    public function test_an_allowlist_naming_a_no_match_skill_does_not_select_it(): void
    {
        $selection = new SkillSelection()->select($this->skills(), $this->helper(['journal-main', 'journal'], []));

        $this->assertSame(['journal'], $selection->selectedKeys());
    }

    public function test_a_required_skill_outside_the_selection_is_refused_with_its_key_and_reason(): void
    {
        $this->expectException(SkillSelectionConflict::class);
        $this->expectExceptionMessage('requires the skill journal-main, but it is not selected for this start (no_match:grant-not-held)');

        new SkillSelection()->select($this->skills(), $this->helper(null, ['journal-main']));
    }

    public function test_a_required_unavailable_skill_refuses_and_an_optional_one_is_left_out(): void
    {
        $skills = [
            ...$this->skills(),
            $this->entry('journal-openai', Conditions::providers(ProviderKey::from('openai'))),
        ];
        $selection = new SkillSelection()->select($skills, $this->helper(null, []));

        $this->assertNotContains('journal-openai', $selection->selectedKeys());
        $this->assertSame('unavailable:provider-unavailable', $selection->excluded[1]->reason);

        $this->expectException(SkillSelectionConflict::class);

        new SkillSelection()->select($skills, $this->helper(null, ['journal-openai']));
    }

    public function test_the_digest_changes_with_the_selection(): void
    {
        $all = new SkillSelection()->select($this->skills(), $this->helper(null, []));
        $narrowed = new SkillSelection()->select($this->skills(), $this->helper(['journal'], []));

        $this->assertNotSame($all->digest, $narrowed->digest);
        $this->assertSame($all->digest, new SkillSelection()->select($this->skills(), $this->helper(null, []))->digest);
    }

    /**
     * @return list<SkillEntry>
     */
    private function skills(): array
    {
        return [
            $this->entry('journal', Conditions::everyone()),
            $this->entry('journal-main', Conditions::dispatchesWork()),
            $this->entry('journal-review', Conditions::profiles(ProfileKey::from('journal-reviewer'))),
        ];
    }

    private function entry(string $key, SkillCondition $condition): SkillEntry
    {
        return new SkillEntry(
            SkillKey::from($key),
            $key,
            'Core',
            SkillOrigin::Shipped,
            'A skill.',
            $condition,
            null,
            new RenderedSkill(SkillKey::from($key), "# {$key}\n", hash('sha256', "# {$key}\n")),
        );
    }

    /**
     * @param  list<string>|null  $allowlist
     * @param  list<string>  $required
     */
    private function helper(array|null $allowlist, array $required): SkillContext
    {
        $snapshot = ProfileSnapshot::from([
            'key' => ProfileKey::from('journal-reviewer'),
            'revision' => 1,
            'base' => ProfileBase::readOnlyHelper(),
            'instructions' => 'Review.',
            'model' => 'opus',
            'skillAllowlist' => $allowlist,
            'requiredSkills' => $required,
            'start' => TestStartPolicies::for(ProfileBase::readOnlyHelper()),
            'authorization' => BuiltInAuthorizations::for(ProfileBase::readOnlyHelper()),
        ]);

        return new SkillContext(
            TestActors::agentIdentity(2),
            TestIds::of(3),
            'main',
            StartProfile::of($snapshot),
            ProgramKey::from('gemini-cli'),
            null,
        );
    }
}
