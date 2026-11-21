<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Commands\StartAgent;
use App\Agents\Contracts\DockerImageVerifier;
use App\Agents\Contracts\HostCapabilities;
use App\Agents\Enums\CapabilityStatusType;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\HostCapabilityType;
use App\Agents\Enums\StartOriginType;
use App\Agents\Exceptions\AccountFolderInvalid;
use App\Agents\Exceptions\CapacityUnavailable;
use App\Agents\Exceptions\ContainerUnavailable;
use App\Agents\Exceptions\ManifestRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\CapacityReservation;
use App\Agents\Support\ArrangementSetting;
use App\Agents\Support\ContainerManifest;
use App\Agents\Support\FolderWorkspace;
use App\Agents\Support\HostCapability;
use App\Agents\Support\HostCapabilityQuery;
use App\Agents\Support\ManifestMount;
use App\Agents\Support\MountRules;
use App\Agents\Support\PreparedStart;
use App\Agents\Support\SecurityOptions;
use App\Agents\Values\ExecutionBudgets;
use App\Agents\Values\ExecutionPolicy;
use App\Agents\Values\HostCapacity;
use App\Agents\Values\SelectedAccount;
use App\Agents\Values\StartPolicy;
use App\Agents\Values\StartRequest;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Models\Account;
use App\Profiles\Values\ProfileBase;
use App\Records\Support\RecordIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A writing helper's container gets exactly the listed controls; anything more is refused by name, and a required
 * container start is admitted only on a proven host, with a verified image and room left, before anything is kept.
 */
final class ContainerManifestTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;
    use WithActiveAccount;

    private const string IMAGE = 'registry.example/journal-helper@sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
    }

    public function test_a_writer_start_compiles_a_manifest_with_exactly_the_listed_controls(): void
    {
        $manifest = ContainerManifest::compile(
            $this->prepared()->sessionId,
            $this->prepared()->workspace,
            ProfileBase::writingHelper()->defaultAccess(),
            $this->policy(),
            'journal-start-1',
            MountRules::local(),
            null,
        );

        $this->assertSame(
            [
                self::IMAGE,
                '10001:10001',
                '/workspace',
                true,
                [],
                true,
                null,
                false,
                [],
                'journal-start-1',
            ],
            [
                $manifest->image,
                $manifest->user,
                $manifest->workdir,
                $manifest->readOnlyRoot,
                $manifest->capabilities,
                $manifest->noNewPrivileges,
                $manifest->securityOptions->seccomp,
                $manifest->privileged,
                $manifest->publishedPorts,
                $manifest->network,
            ],
        );
        $this->assertEquals([ManifestMount::bind('/workspaces/helper-7', '/workspace', true)], $manifest->mounts);
        $this->assertSame(2, $manifest->budgets->cpuCores);
        $this->assertFalse(
            ContainerManifest::compile(
                $this->prepared()->sessionId,
                $this->prepared()->workspace,
                ProfileBase::readOnlyHelper()->defaultAccess(),
                $this->policy(),
                'journal-start-1',
                MountRules::local(),
                null,
            )->mounts[0]->writable,
        );
    }

    public function test_the_mount_follows_the_access_declaration_not_the_type(): void
    {
        $writerAccess = ProfileBase::writingHelper()->defaultAccess();
        $readerStart = $this->prepared();

        $manifest = ContainerManifest::compile(
            $readerStart->sessionId,
            $readerStart->workspace,
            $writerAccess,
            $this->policy(),
            'journal-start-1',
            MountRules::local(),
            null,
        );

        $this->assertTrue($manifest->mounts[0]->writable);
    }

    public function test_a_parent_folder_a_credential_mount_a_mutable_tag_and_a_privileged_flag_are_refused(): void
    {
        $workspace = [ManifestMount::bind('/workspaces/helper-7', '/workspace', true)];

        $this->assertRefused(
            fn () => ContainerManifest::make(
                self::IMAGE,
                '10001:10001',
                true,
                [],
                false,
                'net',
                [ManifestMount::bind('/workspaces/helper-7/..', '/workspace', true)],
                [],
                ExecutionBudgets::defaults(),
                MountRules::local(),
                SecurityOptions::none(),
            ),
        );
        $this->assertRefused(
            fn () => ContainerManifest::make(
                self::IMAGE,
                '10001:10001',
                true,
                [],
                false,
                'net',
                [ManifestMount::bind('/Users/me/.claude', '/workspace', true)],
                [],
                ExecutionBudgets::defaults(),
                MountRules::local(),
                SecurityOptions::none(),
            ),
        );
        $this->assertRefused(
            fn () => ContainerManifest::make(
                self::IMAGE,
                '10001:10001',
                true,
                [],
                false,
                'net',
                [...$workspace, ManifestMount::bind('/var/run/docker.sock', '/var/run/docker.sock', true)],
                [],
                ExecutionBudgets::defaults(),
                MountRules::local(),
                SecurityOptions::none(),
            ),
        );
        $this->assertRefused(
            fn () => ContainerManifest::make(
                'registry.example/journal-helper:latest',
                '10001:10001',
                true,
                [],
                false,
                'net',
                $workspace,
                [],
                ExecutionBudgets::defaults(),
                MountRules::local(),
                SecurityOptions::none(),
            ),
        );
        $this->assertRefused(
            fn () => ContainerManifest::make(
                self::IMAGE,
                '10001:10001',
                true,
                [],
                true,
                'net',
                $workspace,
                [],
                ExecutionBudgets::defaults(),
                MountRules::local(),
                SecurityOptions::none(),
            ),
        );
        $this->assertRefused(
            fn () => ContainerManifest::make(
                self::IMAGE,
                '10001:10001',
                true,
                [],
                false,
                'host',
                $workspace,
                [],
                ExecutionBudgets::defaults(),
                MountRules::local(),
                SecurityOptions::none(),
            ),
        );
    }

    public function test_a_host_without_a_proven_container_runtime_refuses_before_reserving(): void
    {
        $this->signIn();
        $this->app->instance(HostCapabilities::class, new class implements HostCapabilities
        {
            public function capability(HostCapabilityQuery $query): HostCapability
            {
                $status = $query->capability === HostCapabilityType::AccountTransport
                    ? CapabilityStatusType::Supported
                    : CapabilityStatusType::Unverified;

                return new HostCapability($query, $status, 'docs/x.md', 'Runtime unavailable.');
            }
        });

        $this->assertThrows(fn () => $this->start($this->containerRequest()), ContainerUnavailable::class);

        $this->assertSame(0, CapacityReservation::query()->count());
    }

    public function test_capacity_beyond_the_host_refuses(): void
    {
        $this->signIn();
        $this->app->instance(HostCapabilities::class, new class implements HostCapabilities
        {
            public function capability(HostCapabilityQuery $query): HostCapability
            {
                return new HostCapability(
                    $query,
                    CapabilityStatusType::Supported,
                    'docs/x.md',
                    'Proven for this test.',
                );
            }
        });
        $this->app->instance(DockerImageVerifier::class, new class implements DockerImageVerifier
        {
            public function isVerified(string $imageReference): bool
            {
                return true;
            }
        });
        $this->app->instance(HostCapacity::class, new HostCapacity(3, 16 * 1024 ** 3, 50 * 1024 ** 3));

        $this->start($this->containerRequest());

        $this->assertThrows(fn () => $this->start($this->containerRequest()), CapacityUnavailable::class);
        $this->assertSame(1, CapacityReservation::query()->count());
    }

    public function test_a_contained_manifest_takes_its_volumes_account_and_profiles_and_goes_on_the_wire(): void
    {
        $manifest = $this->contained($this->containedMounts(), SecurityOptions::make(
            '/etc/journal/profiles/seccomp.json',
            'journal-agent',
            '/etc/journal/profiles',
        ));
        $wire = json_decode((string) json_encode($manifest), true);

        $this->assertSame(
            [
                [
                    'type' => 'volume',
                    'source' => 'acme-workspace-s1',
                    'target' => '/workspace',
                    'writable' => false,
                    'mustExist' => false,
                ],
                [
                    'type' => 'daemon-bind',
                    'source' => '/srv/journal/accounts/a1',
                    'target' => '/home/journal/.account',
                    'writable' => true,
                    'mustExist' => false,
                ],
                [
                    'type' => 'volume',
                    'source' => 'acme-history-s1',
                    'target' => '/home/journal/.account/projects',
                    'writable' => true,
                    'mustExist' => false,
                ],
            ],
            $wire['mounts'],
        );
        $this->assertSame(
            ['seccomp' => '/etc/journal/profiles/seccomp.json', 'apparmor' => 'journal-agent'],
            $wire['securityOptions'],
        );
        $this->assertSame(ExecutionBudgets::DEFAULT_HOME_BYTES, $wire['budgets']['homeBytes']);
    }

    public function test_a_local_manifest_goes_on_the_wire_as_before_with_its_bind_type(): void
    {
        $manifest = ContainerManifest::compile(
            $this->prepared()->sessionId,
            $this->prepared()->workspace,
            ProfileBase::writingHelper()->defaultAccess(),
            $this->policy(),
            'journal-start-1',
            MountRules::local(),
            null,
        );

        $this->assertSame(
            [
                'type' => 'bind',
                'source' => '/workspaces/helper-7',
                'target' => '/workspace',
                'writable' => true,
                'mustExist' => false,
            ],
            json_decode((string) json_encode($manifest), true)['mounts'][0],
        );
    }

    public function test_an_image_loaded_from_a_saved_file_is_pinned_by_its_id(): void
    {
        $id = 'sha256:'.str_repeat('a', 64);
        $manifest = ContainerManifest::make(
            $id,
            '10001:10001',
            true,
            [],
            false,
            'acme-s1',
            $this->containedMounts(),
            [],
            ExecutionBudgets::defaults(),
            MountRules::contained('acme', '/srv/journal/accounts/a1', new FolderWorkspace('main')),
            SecurityOptions::none(),
        );

        $this->assertSame($id, $manifest->image);
    }

    public function test_a_contained_start_on_an_account_binds_that_accounts_folder_and_nothing_else(): void
    {
        $setting = ArrangementSetting::fromConfig('contained', 'acme', '{"main":{"folder":"main"}}');
        $accountA = new SelectedAccount(new RecordIdentity(Account::LINK_TYPE, '01m7y41pesrb3jvbxmhd5ssfer'), 'claude-code', '/accounts/01a1', 1);
        $accountB = new SelectedAccount(new RecordIdentity(Account::LINK_TYPE, '01m7y41pesrb3jvbxmhd5ssfer'), 'claude-code', '/accounts/01b2', 1);

        $manifestOf = fn (SelectedAccount $account) => ContainerManifest::compile(
            $this->prepared()->sessionId,
            $this->prepared()->workspace,
            ProfileBase::writingHelper()->defaultAccess(),
            $this->policy(),
            'acme-s1',
            $setting->mountRules($account, 'main'),
            null,
        );

        $this->assertEquals(
            [
                ManifestMount::daemonBind('/srv/journal/workspaces/main', '/workspace', true),
                ManifestMount::daemonBind('/srv/journal/accounts/01a1', '/home/journal/.account', true),
                ManifestMount::volume('acme-history-session-1', '/home/journal/.account/projects', true),
            ],
            $manifestOf($accountA)->mounts,
        );
        $this->assertSame('/srv/journal/accounts/01b2', $manifestOf($accountB)->mounts[1]->source);
        $this->assertRefused(fn () => ContainerManifest::make(
            self::IMAGE,
            '10001:10001',
            true,
            [],
            false,
            'acme-s1',
            [ManifestMount::daemonBind('/srv/journal/accounts/01b2', '/home/journal/.account', true)],
            [],
            ExecutionBudgets::defaults(),
            $setting->mountRules($accountA, 'main'),
            SecurityOptions::none(),
        ));
    }

    public function test_an_account_folder_that_is_not_a_plain_id_is_refused_before_any_container(): void
    {
        $setting = ArrangementSetting::fromConfig('contained', 'acme', '{"main":{"folder":"main"}}');

        foreach (['/accounts/..', '/accounts/a1/../b2', '/accounts/A1', '/accounts/a-1'] as $directory) {
            $account = new SelectedAccount(new RecordIdentity(Account::LINK_TYPE, '01m7y41pesrb3jvbxmhd5ssfer'), 'claude-code', $directory, 1);
            $this->assertThrows(fn () => $setting->mountRules($account, 'main'), AccountFolderInvalid::class);
        }

        $this->assertEquals(MountRules::local(), ArrangementSetting::fromConfig('local', '', '{}')->mountRules(
            new SelectedAccount(new RecordIdentity(Account::LINK_TYPE, '01m7y41pesrb3jvbxmhd5ssfer'), 'claude-code', '/Users/me/.journal/accounts/A1', 1),
            'main',
        ));
    }

    public function test_a_contained_session_gets_its_own_history_and_a_resume_the_history_it_resumes(): void
    {
        $contained = MountRules::contained('acme', null, new FolderWorkspace('main'));

        $this->assertSame([], MountRules::local()->sessionMounts('s1', null));
        $this->assertEquals(
            [ManifestMount::volume('acme-history-s1', '/home/journal/.account/projects', true)],
            $contained->sessionMounts('s1', null),
        );
        $this->assertNotEquals($contained->sessionMounts('s1', null), $contained->sessionMounts('s2', null));
        $this->assertEquals(
            [ManifestMount::existingVolume('acme-history-s1', '/home/journal/.account/projects', true)],
            $contained->sessionMounts('s2', 's1'),
        );
    }

    public function test_a_contained_manifest_asking_for_another_mount_is_refused(): void
    {
        [$workspace, $account, $history] = $this->containedMounts();

        foreach ([
            [$workspace, ManifestMount::bind('/home/server/work', '/home/journal/.account', true)],
            [$workspace, ManifestMount::volume('other-workspace-s1', '/home/journal/.account', true)],
            [$workspace, $account, $history, ManifestMount::volume('acme-x-s1', '/workspace', true)],
            [$workspace, ManifestMount::daemonBind('/srv/journal/accounts/a2', '/home/journal/.account', true)],
            [$workspace, ManifestMount::daemonBind('/srv/journal/accounts', '/home/journal/.account', true)],
            [$workspace, ManifestMount::daemonBind('/srv/journal/../etc', '/home/journal/.account', true)],
            [$workspace, ManifestMount::volume('acme-history-s1', '/etc', true)],
        ] as $mounts) {
            $this->assertRefused(fn () => $this->contained($mounts, SecurityOptions::none()));
        }

        $this->assertRefused(fn () => SecurityOptions::make('unconfined,apparmor=unconfined', null, ''));
        $this->assertRefused(fn () => SecurityOptions::make('/tmp/seccomp.json', null, '/etc/journal/profiles'));
    }

    /**
     * @return list<ManifestMount>
     */
    private function containedMounts(): array
    {
        return [
            ManifestMount::volume('acme-workspace-s1', '/workspace', false),
            ManifestMount::daemonBind('/srv/journal/accounts/a1', '/home/journal/.account', true),
            ManifestMount::volume('acme-history-s1', '/home/journal/.account/projects', true),
        ];
    }

    /**
     * @param  list<ManifestMount>  $mounts
     */
    private function contained(array $mounts, SecurityOptions $securityOptions): ContainerManifest
    {
        return ContainerManifest::make(
            self::IMAGE,
            '10001:10001',
            true,
            [],
            false,
            'acme-s1',
            $mounts,
            [],
            ExecutionBudgets::defaults(),
            MountRules::contained('acme', '/srv/journal/accounts/a1', new FolderWorkspace('main')),
            $securityOptions,
        );
    }

    private function assertRefused(\Closure $make): void
    {
        $this->assertThrows($make, ManifestRefused::class);
    }

    private function prepared(): PreparedStart
    {
        return new PreparedStart(
            'start-1',
            'runtime-1',
            'session-1',
            TestSelections::of(),
            ExecutionModeType::RequiredContainer,
            'policy-1',
            '/workspaces/helper-7',
            'account-1',
        );
    }

    private function policy(): ExecutionPolicy
    {
        return ExecutionPolicy::make(
            ExecutionModeType::RequiredContainer,
            self::IMAGE,
            'helper-7',
            ExecutionBudgets::defaults(),
            [],
        );
    }

    private function signIn(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
    }

    private function containerRequest(): StartRequest
    {
        $agent = Agent::create('Builder', 'writing-helper');

        return new StartRequest(
            TestSelections::requestId(),
            $agent->id,
            TestSelections::of(),
            StartOriginType::OwnerRequest,
            'helpers.job 1',
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile($this->policy()),
        );
    }

    private function start(StartRequest $request): mixed
    {
        return $this->app->make(CommandBus::class)->run(new StartAgent($request));
    }
}
