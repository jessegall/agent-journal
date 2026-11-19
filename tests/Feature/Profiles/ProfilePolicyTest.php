<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\UserActorRequired;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Models\RevisionFence;
use App\Agents\Values\Operation;
use App\Agents\Values\ResourceRequest;
use App\Bus\Contracts\CommandBus;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Commands\RevokeProfiles;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Enums\PolicyOriginType;
use App\Profiles\Enums\ProfileChangeType;
use App\Profiles\Events\ProfileRevisionRevoked;
use App\Profiles\Exceptions\ProfilePolicyRefused;
use App\Profiles\Exceptions\ProfileProposalRefused;
use App\Profiles\Support\ProfileProposal;
use App\Profiles\Values\ProfileActivation;
use App\Profiles\Values\ProfileKey;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
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

    private const array TABLES = ['profile_revisions', 'profiles', 'revision_fences', 'command_receipts'];

    private const array WORKER = [
        'type' => 'writing_helper',
        'model' => 'opus',
        'container' => 'required',
        'allow_operations' => [
            [
                'name' => 'shell:journal-check.cleanup',
                'resources' => [['area' => 'scratch', 'target' => '/workspace/.scratch']],
            ],
            ['name' => 'shell:git.push'],
        ],
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(7)), new OwnerAuthority('test'));
    }

    public function test_a_removed_class_blocks_while_an_exact_grant_passes_and_a_denial_wins(): void
    {
        $this->activate([
            'revision' => 1,
            'type_overrides' => [
                'writing_helper' => ['remove_classes' => ['delete:workspace'], 'deny_operations' => ['shell:git.push']],
            ],
            'profiles' => ['journal-worker' => self::WORKER],
        ]);

        $launch = $this->resolver()->snapshotFor(ProfileKey::from('journal-worker'))->launch;
        $access = $launch->access;

        $this->assertFalse($access->decide(self::operation('file.delete', AccessType::Delete, 'workspace'))->allowed);
        $this->assertTrue($access->decide(
            self::operation('shell:journal-check.cleanup', AccessType::Delete, 'scratch', '/workspace/.scratch'),
        )->allowed);
        $push = self::operation('shell:git.push', AccessType::Execute, 'workspace');

        $this->assertFalse($access->decide($push)->allowed);
        $this->assertSame(PolicyOriginType::Profile, $launch->provenance->originOf('access'));
    }

    public function test_a_reader_widened_into_workspace_edits_is_refused_and_nothing_is_activated(): void
    {
        $proposal = [
            'profiles' => [
                'journal-researcher' => ['type' => 'read_only_helper', 'model' => 'opus'],
                'journal-editor' => [
                    'type' => 'read_only_helper',
                    'model' => 'opus',
                    'allow_classes' => ['edit:workspace'],
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
            fn () => $this->activate(['profiles' => ['journal-worker' => [...self::WORKER, 'supervisor' => 'main']]]),
            ProfileProposalRefused::class,
            'supervisor',
        );
        $this->assertThrows(
            fn () => $this->activate(['profiles' => ['journal-worker' => [...self::WORKER, 'container' => 'host']]]),
            ProfilePolicyRefused::class,
            'required container',
        );
    }

    public function test_a_session_keeps_its_revision_and_the_next_launch_gets_the_new_one(): void
    {
        $first = $this->activate(['profiles' => ['journal-worker' => self::WORKER]]);
        $second = $this->activate(['profiles' => ['journal-worker' => [...self::WORKER, 'model' => 'sonnet']]]);
        $third = $this->activate(['profiles' => ['journal-worker' => [...self::WORKER, 'model' => 'sonnet']]]);

        $key = ProfileKey::from('journal-worker');

        $this->assertSame(ProfileChangeType::Added, $first->profiles[0]->change);
        $this->assertSame(ProfileChangeType::Changed, $second->profiles[0]->change);
        $this->assertSame(ProfileChangeType::Unchanged, $third->profiles[0]->change);
        $this->assertSame('opus', $this->resolver()->snapshotAt($key, 1)->model);
        $this->assertSame('sonnet', $this->resolver()->snapshotFor($key)->model);
        $this->assertSame(3, $this->resolver()->snapshotFor($key)->revision);
    }

    public function test_an_agent_cannot_activate(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent(TestIds::of(9)), new OwnerAuthority('test'));

        $this->expectException(UserActorRequired::class);

        $this->activate(['profiles' => ['journal-worker' => self::WORKER]]);
    }

    public function test_revocation_retains_the_fence_of_the_revision_and_tells_subscribers(): void
    {
        Event::fake([ProfileRevisionRevoked::class]);
        $this->activate(['profiles' => ['journal-worker' => self::WORKER]]);
        $revision = $this->resolver()->snapshotFor(ProfileKey::from('journal-worker'));

        $this->app->make(CommandBus::class)->run(new RevokeProfiles([ProfileKey::from('journal-worker')]));

        Event::assertDispatched(
            ProfileRevisionRevoked::class,
            fn (ProfileRevisionRevoked $event) => $event->revision === $revision->revision
                && RevisionFence::isPending($event->revisionReference),
        );
    }

    /**
     * @param  array<string, mixed>  $configuration
     */
    private function activate(array $configuration): ProfileActivation
    {
        $proposal = ProfileProposal::fromConfiguration($configuration);

        return $this->app->make(CommandBus::class)->run(new ActivateProfiles($proposal));
    }

    private function resolver(): ProfileResolver
    {
        return $this->app->make(ProfileResolver::class);
    }

    private static function operation(
        string $name,
        AccessType $access,
        string $area,
        string $target = '/workspace/file.txt',
    ): Operation {
        $resource = new ResourceRequest(ResourceAreaType::from($area), $target);

        return new Operation('shell', $name, [$access], [$resource], [], 1);
    }
}
