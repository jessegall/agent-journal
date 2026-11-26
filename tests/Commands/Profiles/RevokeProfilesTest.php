<?php

declare(strict_types=1);

namespace Tests\Commands\Profiles;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\Profiles\RevokeProfiles\RevokeProfilesCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\Profiles\ModelTier;
use App\Events\Accounts\ProfileRevisionRevoked;
use App\Exceptions\ProfileMissing;
use App\Exceptions\ProfileRetired;
use App\Models\Profiles\Profile;
use App\Models\Profiles\ProfileRevisionHold;
use App\Support\ProfileProposal;
use App\Support\ProposedProfile;
use App\Values\ProfileActivation;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner revokes profiles: a revoked profile is retired for its readers and keeps its identity when it is
 * activated again, and an unknown key is refused.
 */
#[TestsCommand(RevokeProfilesCommand::class)]
final class RevokeProfilesTest extends TestCase
{
    use CommitsHookRows;
    use HasContainerSupport;

    private const array TABLES = ['profile_revisions', 'profiles', 'profile_revision_holds', 'command_receipts'];

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
    public function test_revocation_retains_the_fence_of_the_revision_and_tells_subscribers(): void
    {
        Event::fake([ProfileRevisionRevoked::class]);
        $this->activateConfiguration(['profiles' => ['journal-worker' => ['base' => 'writing-helper', 'tier' => 3, 'container' => 'required']]]);
        $revision = $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from('journal-worker'));

        $this->app->make(CommandBus::class)->run(new RevokeProfilesCommand([ProfileKey::from('journal-worker')]));

        Event::assertDispatched(
            ProfileRevisionRevoked::class,
            fn (ProfileRevisionRevoked $event) => $event->revision === $revision->revision
                && ProfileRevisionHold::query()->where('profile_key', $event->key->key)
                    ->where('profile_revision', $event->revision)->whereNull('reconciled_at')->exists(),
        );
    }

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

    /**
     * @param  array<string, mixed>  $configuration
     */
    private function activateConfiguration(array $configuration): ProfileActivation
    {
        return $this->app->make(CommandBus::class)->run(
            new ActivateProfilesCommand(ProfileProposal::fromConfiguration($configuration)),
        );
    }
}
