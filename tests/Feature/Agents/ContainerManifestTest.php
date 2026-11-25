<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Hosts\DockerImageVerifier;
use App\Contracts\Hosts\HostCapabilities;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Agents\WorkspaceUse;
use App\Enums\Drivers\DriverType;
use App\Enums\Drivers\StartProfileType;
use App\Enums\Projects\CapabilityStatusType;
use App\Enums\Projects\HostCapabilityType;
use App\Enums\Sessions\StartOriginType;
use App\Exceptions\AccountFolderInvalid;
use App\Exceptions\CapacityUnavailable;
use App\Exceptions\ContainerUnavailable;
use App\Exceptions\ManifestRefused;
use App\Models\Access\User;
use App\Models\Accounts\Account;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\CapacityReservation;
use App\Support\Access\AccessSettings;
use App\Support\ArrangementSetting;
use App\Support\ContainerManifest;
use App\Support\FolderWorkspace;
use App\Support\HostCapability;
use App\Support\HostCapabilityQuery;
use App\Support\ManifestMount;
use App\Support\MountRules;
use App\Support\PreparedStart;
use App\Support\RecordIdentity;
use App\Support\SecurityOptions;
use App\Values\ExecutionBudgets;
use App\Values\ExecutionPolicy;
use App\Values\HostCapacity;
use App\Values\ProfileBase;
use App\Values\SelectedAccount;
use App\Values\StartPolicy;
use App\Values\StartRequest;
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

    private const string GIT_SOURCE = '{"main":{"git":"git@github.com:acme/shop.git","revision":"main",'
        .'"deploy_key_secret":"deploy_key_main"}}';

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
            WorkspaceUse::Shared,
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
                $manifest->isReadOnlyRoot,
                $manifest->capabilities,
                $manifest->blocksNewPrivileges,
                $manifest->securityOptions->seccomp,
                $manifest->isPrivileged,
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
                WorkspaceUse::ReadOnly,
                $this->policy(),
                'journal-start-1',
                MountRules::local(),
                null,
            )->mounts[0]->isWritable,
        );
    }

    public function test_the_mount_follows_the_access_declaration_and_the_parent_not_the_profile_name(): void
    {
        $main = new AgentSession();
        $helper = new AgentSession();
        $helper->parent_session_id = 'session-main';

        $this->assertSame(WorkspaceUse::ReadOnly, $helper->workspaceUse(ProfileBase::readOnlyHelper()->defaultAccess()));
        $this->assertSame(WorkspaceUse::OwnCheckout, $helper->workspaceUse(ProfileBase::writingHelper()->defaultAccess()));
        $this->assertSame(WorkspaceUse::Shared, $main->workspaceUse(ProfileBase::mainAgent()->defaultAccess()));
        $this->assertSame(WorkspaceUse::Shared, $main->workspaceUse(ProfileBase::writingHelper()->defaultAccess()));
    }

    public function test_a_contained_read_only_helper_mounts_the_mains_workspace_read_only_its_history_and_account(): void
    {
        $setting = ArrangementSetting::fromConfig('contained', 'acme', self::GIT_SOURCE);
        $account = new SelectedAccount(new RecordIdentity(Account::linkType(), '01m7y41pesrb3jvbxmhd5ssfer'), 'claude-code', '/accounts/01b2', 1);

        $manifest = ContainerManifest::compile(
            'helper-1',
            '/ignored',
            WorkspaceUse::ReadOnly,
            $this->policy(),
            'acme-helper-1',
            $setting->mountRules($account, 'main'),
            null,
        );

        $this->assertEquals(
            [
                ManifestMount::volume('acme-workspace-main', '/workspace', false),
                ManifestMount::daemonBind('/srv/journal/accounts/01b2', '/home/journal/.account', true),
                ManifestMount::volume('acme-history-helper-1', '/home/journal/.account/projects', true),
                ManifestMount::daemonBind('/srv/journal/sessions/helper-1', '/tmp/journal-session', false),
                ManifestMount::daemonBind(
                    '/srv/journal/sessions/helper-1/managed/managed-settings.json',
                    '/etc/claude-code/managed-settings.json',
                    false,
                ),
            ],
            $manifest->mounts,
        );
    }

    public function test_a_contained_writer_mounts_its_own_checkout_and_names_the_source_the_host_fills(): void
    {
        $setting = ArrangementSetting::fromConfig('contained', 'acme', self::GIT_SOURCE);

        $manifest = ContainerManifest::compile(
            'writer-1',
            '/ignored',
            WorkspaceUse::OwnCheckout,
            $this->policy(),
            'acme-writer-1',
            $setting->mountRules(null, 'main'),
            null,
        );
        $wire = json_decode((string) json_encode($manifest), true);
        $workspace = $wire['mounts'][0];

        $this->assertSame(
            [
                'type' => 'volume',
                'source' => 'acme-workspace-main',
                'target' => '/workspace',
                'writable' => true,
                'mustExist' => false,
                'checkout' => true,
            ],
            $workspace,
        );
        $this->assertSame(
            [
                '/workspace',
                '/home/journal/.account/projects',
                '/tmp/journal-session',
                '/etc/claude-code/managed-settings.json',
            ],
            array_map(fn (ManifestMount $mount) => $mount->target, $manifest->mounts),
        );
        $this->assertSame(
            [
                'clone' => [
                    'volume' => 'acme-workspace-main',
                    'repository' => 'git@github.com:acme/shop.git',
                    'revision' => 'main',
                    'deployKeySecret' => 'deploy_key_main',
                ],
                'folder' => null,
            ],
            $wire['workspacePreparation'],
        );
        $this->assertTrue(
            MountRules::local()->workspaceMount('/workspaces/writer-1', WorkspaceUse::OwnCheckout)->isWritable,
        );
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
        $this->assertSame(1, AgentSession::query()->count());
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
                    'checkout' => false,
                ],
                [
                    'type' => 'daemon-bind',
                    'source' => '/srv/journal/accounts/a1',
                    'target' => '/home/journal/.account',
                    'writable' => true,
                    'mustExist' => false,
                    'checkout' => false,
                ],
                [
                    'type' => 'volume',
                    'source' => 'acme-history-s1',
                    'target' => '/home/journal/.account/projects',
                    'writable' => true,
                    'mustExist' => false,
                    'checkout' => false,
                ],
            ],
            $wire['mounts'],
        );
        $this->assertSame(
            ['seccomp' => '/etc/journal/profiles/seccomp.json', 'apparmor' => 'journal-agent'],
            $wire['securityOptions'],
        );
        $this->assertSame(ExecutionBudgets::DEFAULT_HOME_BYTES, $wire['budgets']['homeBytes']);
        $this->assertSame(['clone' => null, 'folder' => 'main'], $wire['workspacePreparation']);
    }

    public function test_a_local_manifest_goes_on_the_wire_as_before_with_its_bind_type(): void
    {
        $manifest = ContainerManifest::compile(
            $this->prepared()->sessionId,
            $this->prepared()->workspace,
            WorkspaceUse::Shared,
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
                'checkout' => false,
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
        $accountA = new SelectedAccount(new RecordIdentity(Account::linkType(), '01m7y41pesrb3jvbxmhd5ssfer'), 'claude-code', '/accounts/01a1', 1);
        $accountB = new SelectedAccount(new RecordIdentity(Account::linkType(), '01m7y41pesrb3jvbxmhd5ssfer'), 'claude-code', '/accounts/01b2', 1);

        $manifestOf = fn (SelectedAccount $account) => ContainerManifest::compile(
            $this->prepared()->sessionId,
            $this->prepared()->workspace,
            WorkspaceUse::Shared,
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
                ManifestMount::daemonBind('/srv/journal/sessions/session-1', '/tmp/journal-session', false),
                ManifestMount::daemonBind(
                    '/srv/journal/sessions/session-1/managed/managed-settings.json',
                    '/etc/claude-code/managed-settings.json',
                    false,
                ),
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
            $account = new SelectedAccount(new RecordIdentity(Account::linkType(), '01m7y41pesrb3jvbxmhd5ssfer'), 'claude-code', $directory, 1);
            $this->assertThrows(fn () => $setting->mountRules($account, 'main'), AccountFolderInvalid::class);
        }

        $this->assertEquals(MountRules::local(), ArrangementSetting::fromConfig('local', '', '{}')->mountRules(
            new SelectedAccount(new RecordIdentity(Account::linkType(), '01m7y41pesrb3jvbxmhd5ssfer'), 'claude-code', '/Users/me/.journal/accounts/A1', 1),
            'main',
        ));
    }

    public function test_a_contained_session_gets_its_own_history_and_a_resume_the_history_it_resumes(): void
    {
        $contained = MountRules::contained('acme', null, new FolderWorkspace('main'));

        $this->assertSame([], MountRules::local()->sessionMounts('s1', null));
        $this->assertEquals(
            [
                ManifestMount::volume('acme-history-s1', '/home/journal/.account/projects', true),
                ManifestMount::daemonBind('/srv/journal/sessions/s1', '/tmp/journal-session', false),
                ManifestMount::daemonBind(
                    '/srv/journal/sessions/s1/managed/managed-settings.json',
                    '/etc/claude-code/managed-settings.json',
                    false,
                ),
            ],
            $contained->sessionMounts('s1', null),
        );
        $this->assertNotEquals($contained->sessionMounts('s1', null), $contained->sessionMounts('s2', null));
        $this->assertEquals(
            [
                ManifestMount::existingVolume('acme-history-s1', '/home/journal/.account/projects', true),
                ManifestMount::daemonBind('/srv/journal/sessions/s2', '/tmp/journal-session', false),
                ManifestMount::daemonBind(
                    '/srv/journal/sessions/s2/managed/managed-settings.json',
                    '/etc/claude-code/managed-settings.json',
                    false,
                ),
            ],
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

    public function test_a_protected_start_runs_its_init_as_root_with_three_capabilities_and_says_so(): void
    {
        $manifest = $this->protected($this->containedMounts(), ['SETUID', 'SETGID', 'SETPCAP'], '0:0');
        $sent = json_decode((string) json_encode($manifest), true);

        $this->assertSame(['0:0', ['SETUID', 'SETGID', 'SETPCAP'], 'protected-account', true, false], [
            $sent['user'],
            $sent['capabilities'],
            $sent['startProfile'],
            $sent['noNewPrivileges'],
            $sent['privileged'],
        ]);
    }

    public function test_a_protected_start_with_another_user_an_extra_capability_or_no_account_is_refused(): void
    {
        $withoutAccount = array_values(array_filter(
            $this->containedMounts(),
            fn (ManifestMount $mount) => $mount->target !== '/home/journal/.account',
        ));

        $this->assertRefused(fn () => $this->protected($this->containedMounts(), ['SETUID', 'SETGID', 'SETPCAP'], '10001:10001'));
        $this->assertRefused(fn () => $this->protected($this->containedMounts(), ['SETUID', 'SETGID', 'SETPCAP', 'NET_ADMIN'], '0:0'));
        $this->assertRefused(fn () => $this->protected($withoutAccount, ['SETUID', 'SETGID', 'SETPCAP'], '0:0'));
    }

    public function test_a_standard_start_still_sends_its_standard_start_profile(): void
    {
        $sent = json_decode((string) json_encode($this->contained($this->containedMounts(), SecurityOptions::none())), true);

        $this->assertSame('standard', $sent['startProfile']);
    }

    /**
     * @param  list<ManifestMount>  $mounts
     * @param  list<string>  $capabilities
     */
    private function protected(array $mounts, array $capabilities, string $user): ContainerManifest
    {
        return ContainerManifest::make(
            self::IMAGE,
            $user,
            true,
            $capabilities,
            false,
            'acme-s1',
            $mounts,
            [],
            ExecutionBudgets::defaults(),
            MountRules::contained('acme', '/srv/journal/accounts/a1', new FolderWorkspace('main')),
            SecurityOptions::none(),
            false,
            StartProfileType::ProtectedAccount,
        );
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
        return new ExecutionPolicy(
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
            new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehew'),
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile($this->policy()),
            driverType: DriverType::Headless,
        );
    }

    private function start(StartRequest $request): mixed
    {
        return $this->app->make(CommandBus::class)->run(new StartAgentCommand($request));
    }
}
