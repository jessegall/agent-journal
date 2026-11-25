<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\Profiles\RevokeProfiles\RevokeProfilesCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\Agents\AccessType;
use App\Enums\Profiles\ModelTier;
use App\Enums\Profiles\PolicyOriginType;
use App\Enums\Profiles\ProfileChangeType;
use App\Events\Accounts\ProfileRevisionRevoked;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\ProfilePolicyRefused;
use App\Exceptions\ProfileProposalRefused;
use App\Models\Profiles\ProfileRevisionHold;
use App\Support\ActorReference;
use App\Support\ProfileProposal;
use App\Values\Operation;
use App\Values\ProfileActivation;
use App\Values\ProfileKey;
use App\Values\ResourceRequest;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * Activation resolves a proposal into policies: a project removal blocks a class, an exact grant still passes inside
 * it, a denial always wins; a reader cannot be widened into workspace writes; unknown operations and unsupported
 * fields are refused; a session keeps the revision it started with; only a user activates; revocation retains the
 * fence of the revision's sessions.
 */
final class ProfilePolicyTest extends TestCase
{
    use CommitsHookRows;

    private const string REQUIRED_CONTAINER = 'required container';

    private const array TABLES = ['profile_revisions', 'profiles', 'profile_revision_holds', 'command_receipts'];

    private const array WORKER = [
        'base' => 'writing-helper',
        'tier' => 3,
        'container' => 'required',
        'allow_operations' => [
            [
                'name' => 'shell:journal-check.cleanup',
                'resources' => [['type' => 'path', 'target' => '/workspace/.scratch']],
            ],
            ['name' => 'shell:git.push'],
        ],
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->actAsUserId(TestIds::of(7));
    }

    public function test_a_removed_class_blocks_while_an_exact_grant_passes_and_a_denial_wins(): void
    {
        $this->activate([
            'revision' => 1,
            'base_overrides' => [
                'writing-helper' => ['remove_paths' => ['delete:.'], 'deny_operations' => ['shell:git.push']],
            ],
            'profiles' => ['journal-worker' => self::WORKER],
        ]);

        $start = $this->resolver()->snapshotFor(ProfileKey::from('journal-worker'))->start;
        $access = $start->access;

        $this->assertFalse($access->decide(self::operation('file.delete', AccessType::Delete))->isAllowed);
        $this->assertTrue($access->decide(
            self::operation('shell:journal-check.cleanup', AccessType::Delete, '/workspace/.scratch'),
        )->isAllowed);
        $push = self::operation('shell:git.push', AccessType::Execute);

        $this->assertFalse($access->decide($push)->isAllowed);
        $this->assertSame(PolicyOriginType::Profile, $start->provenance->originOf('access'));
    }

    public function test_a_reader_widened_into_workspace_edits_is_refused_and_nothing_is_activated(): void
    {
        $proposal = [
            'profiles' => [
                'journal-researcher' => ['base' => 'read-only-helper', 'tier' => 3],
                'journal-editor' => [
                    'base' => 'read-only-helper',
                    'tier' => 3,
                    'allow_paths' => ['edit:.'],
                ],
            ],
        ];

        $this->assertThrows(fn () => $this->activate($proposal), ProfilePolicyRefused::class, 'writing_helper');
        $this->assertFalse($this->resolver()->has(ProfileKey::from('journal-researcher')));
    }

    public function test_unknown_operations_and_unsupported_fields_are_refused(): void
    {
        $this->assertThrows(fn () => $this->activate(['profiles' => ['journal-worker' => [
            ...self::WORKER,
            'allow_operations' => [['name' => 'shell:rm.everything']],
        ]]]), ProfilePolicyRefused::class, 'shell:rm.everything');
        $this->assertThrows(
            fn () => $this->activate(['profiles' => ['journal-worker' => [...self::WORKER, 'instances' => 'many']]]),
            ProfileProposalRefused::class,
            'instances',
        );
        $this->assertThrows(
            fn () => $this->activate(['profiles' => ['journal-worker' => [...self::WORKER, 'container' => 'host']]]),
            ProfilePolicyRefused::class,
            self::REQUIRED_CONTAINER,
        );
    }

    public function test_a_session_keeps_its_revision_and_the_next_start_gets_the_new_one(): void
    {
        $first = $this->activate(['profiles' => ['journal-worker' => self::WORKER]]);
        $second = $this->activate(['profiles' => ['journal-worker' => [...self::WORKER, 'tier' => 2]]]);
        $third = $this->activate(['profiles' => ['journal-worker' => [...self::WORKER, 'tier' => 2]]]);

        $key = ProfileKey::from('journal-worker');

        $this->assertSame(ProfileChangeType::Added, $first->profiles[0]->change);
        $this->assertSame(ProfileChangeType::Changed, $second->profiles[0]->change);
        $this->assertSame(ProfileChangeType::Unchanged, $third->profiles[0]->change);
        $this->assertSame(ModelTier::Inventive, $this->resolver()->snapshotAt($key, 1)->preferredTier);
        $this->assertSame(ModelTier::General, $this->resolver()->snapshotFor($key)->preferredTier);
        $this->assertSame(3, $this->resolver()->snapshotFor($key)->revision);
    }

    public function test_an_agent_cannot_activate(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forAgent(TestIds::of(9)),
            TestStartAuthority::forAgent(TestIds::of(9)),
        );

        $this->expectException(ActorNotAllowed::class);

        $this->activate(['profiles' => ['journal-worker' => self::WORKER]]);
    }

    public function test_revocation_retains_the_fence_of_the_revision_and_tells_subscribers(): void
    {
        Event::fake([ProfileRevisionRevoked::class]);
        $this->activate(['profiles' => ['journal-worker' => self::WORKER]]);
        $revision = $this->resolver()->snapshotFor(ProfileKey::from('journal-worker'));

        $this->app->make(CommandBus::class)->run(new RevokeProfilesCommand([ProfileKey::from('journal-worker')]));

        Event::assertDispatched(
            ProfileRevisionRevoked::class,
            fn (ProfileRevisionRevoked $event) => $event->revision === $revision->revision
                && ProfileRevisionHold::query()->where('profile_key', $event->key->key)
                    ->where('profile_revision', $event->revision)->whereNull('reconciled_at')->exists(),
        );
    }

    /**
     * @param  array<string, mixed>  $configuration
     */
    private function activate(array $configuration): ProfileActivation
    {
        $proposal = ProfileProposal::fromConfiguration($configuration);

        return $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand($proposal));
    }

    private function resolver(): ProfileResolver
    {
        return $this->app->make(ProfileResolver::class);
    }

    private static function operation(
        string $name,
        AccessType $access,
        string $target = '/workspace/file.txt',
    ): Operation {
        $resource = ResourceRequest::path($target);

        return new Operation('shell', $name, [$access], [$resource], [], 1);
    }
}
