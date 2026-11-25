<?php

declare(strict_types=1);

namespace Tests\Commands\Profiles;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\Profiles\RevokeProfiles\RevokeProfilesCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\Profiles\ModelTier;
use App\Exceptions\ProfileMissing;
use App\Exceptions\ProfileRetired;
use App\Models\Profiles\Profile;
use App\Support\ProposedProfile;
use App\Values\ProfileActivation;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner revokes profiles: a revoked profile is retired for its readers and keeps its identity when it is
 * activated again, and an unknown key is refused.
 */
final class RevokeProfilesTest extends TestCase
{
    use CommitsHookRows;
    use HasContainerSupport;

    private const array TABLES = ['profile_revisions', 'profiles', 'command_receipts'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->actAsUserId(TestIds::of(7));
    }

    public function test_a_revoked_profile_is_retired_for_the_reader_and_activating_it_again_keeps_its_identity(): void
    {
        $this->activate($this->reviewer('Review the change.', null));
        $id = Profile::findByKey(ProfileKey::from('journal-reviewer'))->id;
        $resolver = $this->app->make(ProfileResolver::class);

        $revoke = new RevokeProfilesCommand([ProfileKey::from('journal-reviewer')]);

        $this->assertSame(1, $this->app->make(CommandBus::class)->run($revoke));
        $this->assertFalse($resolver->has(ProfileKey::from('journal-reviewer')));

        $this->assertThrows(
            fn () => $resolver->snapshotFor(ProfileKey::from('journal-reviewer')),
            ProfileRetired::class,
        );

        $this->activate($this->reviewer('Back again.', null));
        $this->assertTrue($resolver->has(ProfileKey::from('journal-reviewer')));
        $this->assertSame($id, Profile::findByKey(ProfileKey::from('journal-reviewer'))->id);
        $this->assertSame(2, $resolver->snapshotFor(ProfileKey::from('journal-reviewer'))->revision);
    }

    public function test_an_unknown_key_is_refused_by_the_reader_and_by_revocation(): void
    {
        $this->assertFalse($this->app->make(ProfileResolver::class)->has(ProfileKey::from('journal-nobody')));

        $this->expectException(ProfileMissing::class);

        $this->app->make(CommandBus::class)->run(new RevokeProfilesCommand([ProfileKey::from('journal-nobody')]));
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
