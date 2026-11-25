<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Profiles\ModelTier;
use App\Exceptions\ProfileRevisionImmutable;
use App\Models\Profiles\Profile;
use App\Models\Profiles\ProfileRevision;
use App\Support\ProposedProfile;
use App\Values\ProfileActivation;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\ActsAsTestUser;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * A stored profile revision never changes, and the console lists and shows a profile with its skill lists.
 */
final class ProfileStorageTest extends TestCase
{
    use ActsAsTestUser;
    use CommitsHookRows;
    use HasContainerSupport;

    private const array TABLES = ['profile_revisions', 'profiles', 'command_receipts'];

    public function test_a_revision_refuses_to_change(): void
    {
        $this->activate($this->reviewer('Review the change.', null));
        $revision = ProfileRevision::findNumbered(Profile::findByKey(ProfileKey::from('journal-reviewer')), 1);
        $revision->instructions = 'Changed in place.';

        $this->expectException(ProfileRevisionImmutable::class);

        $revision->save();
    }

    public function test_the_console_lists_and_shows_a_profile_with_its_skill_lists(): void
    {
        $this->activate($this->reviewer('Review the change.', null));
        $this->activate(
            TestProposals::profile('journal-quiet', ProfileBase::writingHelper(), 'Write.', ModelTier::General, [], ['journal']),
        );

        $this->artisan('profile:list')
            ->expectsOutputToContain('journal-reviewer')
            ->expectsOutputToContain('journal-quiet')
            ->assertSuccessful();
        $this->artisan('profile:show', ['key' => 'journal-reviewer'])
            ->expectsOutputToContain('Starts from: Read-only helper')
            ->expectsOutputToContain('Skill allowlist: absent, every applicable skill')
            ->expectsOutputToContain('Required skills: none')
            ->assertSuccessful();
        $this->artisan('profile:show', ['key' => 'journal-quiet'])
            ->expectsOutputToContain('Skill allowlist: empty, no skills')
            ->expectsOutputToContain('Required skills: journal')
            ->assertSuccessful();
    }

    /**
     * @param  list<string>|null  $allowlist
     */
    private function reviewer(string $instructions, array|null $allowlist): ProposedProfile
    {
        return TestProposals::profile(
            'journal-reviewer',
            ProfileBase::readOnlyHelper(),
            $instructions,
            ModelTier::Inventive,
            $allowlist,
        );
    }

    private function activate(ProposedProfile $profile): ProfileActivation
    {
        return $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(TestProposals::of($profile)));
    }
}
