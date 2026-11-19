<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\TrustedEntryAuthority;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Commands\RevokeProfiles;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Enums\ProfileType;
use App\Profiles\Exceptions\ProfileMissing;
use App\Profiles\Exceptions\ProfileRetired;
use App\Profiles\Exceptions\ProfileRevisionImmutable;
use App\Profiles\Models\Profile;
use App\Profiles\Models\ProfileRevision;
use App\Profiles\Support\ProposedProfile;
use App\Profiles\Values\ProfileActivation;
use App\Profiles\Values\ProfileKey;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Core stores profiles as a stable key with immutable revisions: activation appends, the reader returns the current
 * revision, revocation retires the key, and the console shows a revision with its skill lists.
 */
final class ProfileStorageTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['profile_revisions', 'profiles', 'command_receipts'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(7)), new TrustedEntryAuthority('test'));
    }

    public function test_a_second_activation_appends_revision_2_and_keeps_revision_1_readable(): void
    {
        $first = $this->activate($this->reviewer('Review the change.', null));
        $second = $this->activate($this->reviewer('Review the change twice.', []));

        $this->assertSame(1, $first->profiles[0]->revision);
        $this->assertSame(2, $second->profiles[0]->revision);
        $this->assertSame(1, Profile::query()->count());

        $snapshot = $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from('journal-reviewer'));
        $this->assertSame(2, $snapshot->revision);
        $this->assertSame('Review the change twice.', $snapshot->instructions);
        $this->assertSame([], $snapshot->skillAllowlist);
        $this->assertSame(ProfileType::ReadOnlyHelper, $snapshot->type);

        $profile = Profile::byKey(ProfileKey::from('journal-reviewer'));
        $this->assertSame('Review the change.', ProfileRevision::numbered($profile, 1)->instructions);
        $this->assertNull(ProfileRevision::numbered($profile, 1)->skill_allowlist);
    }

    public function test_a_revision_refuses_to_change(): void
    {
        $this->activate($this->reviewer('Review the change.', null));
        $revision = ProfileRevision::numbered(Profile::byKey(ProfileKey::from('journal-reviewer')), 1);
        $revision->instructions = 'Changed in place.';

        $this->expectException(ProfileRevisionImmutable::class);

        $revision->save();
    }

    public function test_a_revoked_profile_is_retired_for_the_reader_and_activating_it_again_keeps_its_identity(): void
    {
        $this->activate($this->reviewer('Review the change.', null));
        $id = Profile::byKey(ProfileKey::from('journal-reviewer'))->id;
        $resolver = $this->app->make(ProfileResolver::class);

        $revoke = new RevokeProfiles([ProfileKey::from('journal-reviewer')]);

        $this->assertSame(1, $this->app->make(CommandBus::class)->run($revoke));
        $this->assertFalse($resolver->has(ProfileKey::from('journal-reviewer')));

        try {
            $resolver->snapshotFor(ProfileKey::from('journal-reviewer'));
            $this->fail('A retired profile was read.');
        } catch (ProfileRetired) {
        }

        $this->activate($this->reviewer('Back again.', null));
        $this->assertTrue($resolver->has(ProfileKey::from('journal-reviewer')));
        $this->assertSame($id, Profile::byKey(ProfileKey::from('journal-reviewer'))->id);
        $this->assertSame(2, $resolver->snapshotFor(ProfileKey::from('journal-reviewer'))->revision);
    }

    public function test_an_unknown_key_is_refused_by_the_reader_and_by_revocation(): void
    {
        $this->assertFalse($this->app->make(ProfileResolver::class)->has(ProfileKey::from('journal-nobody')));

        $this->expectException(ProfileMissing::class);

        $this->app->make(CommandBus::class)->run(new RevokeProfiles([ProfileKey::from('journal-nobody')]));
    }

    public function test_the_console_lists_and_shows_a_profile_with_its_skill_lists(): void
    {
        $this->activate($this->reviewer('Review the change.', null));
        $this->activate(
            TestProposals::profile('journal-quiet', ProfileType::WritingHelper, 'Write.', 'sonnet', [], ['journal']),
        );

        $this->artisan('profile:list')
            ->expectsOutputToContain('journal-reviewer')
            ->expectsOutputToContain('journal-quiet')
            ->assertSuccessful();
        $this->artisan('profile:show', ['key' => 'journal-reviewer'])
            ->expectsOutputToContain('Type: read_only_helper')
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
            ProfileType::ReadOnlyHelper,
            $instructions,
            'opus',
            $allowlist,
        );
    }

    private function activate(ProposedProfile $profile): ProfileActivation
    {
        return $this->app->make(CommandBus::class)->run(new ActivateProfiles(TestProposals::of($profile)));
    }
}
