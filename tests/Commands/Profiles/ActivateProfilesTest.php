<?php

declare(strict_types=1);

namespace Tests\Commands\Profiles;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\Profiles\ModelTier;
use App\Models\Access\User;
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
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner activates profiles: each activation is kept with the actor that sent it as its author, and a second
 * activation adds the next revision while the first stays readable.
 */
final class ActivateProfilesTest extends TestCase
{
    use ActsAsTestUser;
    use CommitsHookRows;
    use HasContainerSupport;

    private const string REVIEW_TWICE = 'Review the change twice.';

    private const string REVIEW_ONCE = 'Review the change.';

    private const array TABLES = ['profile_revisions', 'profiles', 'command_receipts'];

    public function test_a_second_activation_appends_revision_2_and_keeps_revision_1_readable(): void
    {
        $first = $this->activate($this->reviewer('Review the change.', null));
        $second = $this->activate($this->reviewer('Review the change twice.', []));

        $this->assertSame(1, $first->profiles[0]->revision);
        $this->assertSame(2, $second->profiles[0]->revision);
        $this->assertSame(1, Profile::query()->count());

        $snapshot = $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from('journal-reviewer'));
        $this->assertSame(2, $snapshot->revision);
        $this->assertSame(self::REVIEW_TWICE, $snapshot->instructions);
        $this->assertSame([], $snapshot->skillAllowlist);
        $this->assertSame(ProfileBase::readOnlyHelper()->key, $snapshot->base->key);

        $profile = Profile::findByKey(ProfileKey::from('journal-reviewer'));
        $this->assertSame(self::REVIEW_ONCE, ProfileRevision::findNumbered($profile, 1)->instructions);
        $this->assertNull(ProfileRevision::findNumbered($profile, 1)->skill_allowlist);
    }

    public function test_an_activation_records_the_dispatching_actor_as_author(): void
    {
        $this->activate($this->reviewer('Review the change.', null));

        $revision = ProfileRevision::findNumbered(Profile::findByKey(ProfileKey::from('journal-reviewer')), 1);
        $this->assertSame([User::storedType(), TestIds::of(7)], [$revision->author_type, $revision->author_id]);
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
