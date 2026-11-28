<?php

declare(strict_types=1);

namespace Tests\Machinery\Agents;

use App\Agents\ContainerManifest;
use App\Agents\Drivers\Enums\StartProfileType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\WorkspaceUse;
use App\Agents\Exceptions\ManifestRefused;
use App\Agents\SecurityOptions;
use App\Files\ManifestMount;
use App\Hosts\ArrangementSetting;
use App\Hosts\Exceptions\AccountFolderInvalid;
use App\Hosts\FolderWorkspace;
use App\Models\Accounts\Account;
use App\Sessions\Values\ExecutionPolicy;
use App\Support\HelperMounts;
use App\Support\RecordIdentity;
use App\Values\ExecutionBudgets;
use App\Values\SelectedAccount;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A writing helper's container gets exactly the listed controls; anything more is refused by name, and a required
 * container start is admitted only on a proven host, with a verified image and room left, before anything is kept.
 */
#[TestsMachinery(ContainerManifest::class)]
final class ContainerManifestTest extends TestCase
{
    /**
     * A plan file a contained session mounts read-only at a place of its own.
     */
    private const string POLICY_FILE = 'managed-settings.json';

    private const string POLICY_TARGET = '/etc/claude-code/managed-settings.json';

    private const string SESSION = 'session-1';

    private const string WORKSPACE = '/workspaces/helper-7';

    use RefreshHookDatabase;
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
            self::SESSION,
            self::IMAGE,
            self::WORKSPACE,
            WorkspaceUse::Shared,
            $this->policy(),
            'journal-start-1',
            HelperMounts::local(),
            null,
            SecurityOptions::none(),
        );

        $sent = $manifest->protocolData()->toArray();

        $this->assertSame(
            [self::IMAGE, '10001:10001', '/workspace', [], true, [], true, '', 'journal-start-1', 'no', ['/tmp', '/run/journal', '/home/journal']],
            [
                $sent['image'],
                $sent['user'],
                $sent['workdir'],
                $sent['entrypoint'],
                $sent['isReadOnlyRoot'],
                $sent['capabilities'],
                $sent['blocksNewPrivileges'],
                $sent['securityOptions']['seccomp'],
                $sent['network'],
                $sent['restart'],
                array_column($sent['tmpfs'], 'target'),
            ],
        );
        $this->assertEquals([ManifestMount::bind('/workspaces/helper-7', '/workspace', true)], $manifest->mounts);
        $this->assertSame(2, $manifest->budgets->cpuCores);
        $this->assertFalse(
            ContainerManifest::compile(
                self::SESSION,
                self::IMAGE,
                self::WORKSPACE,
                WorkspaceUse::ReadOnly,
                $this->policy(),
                'journal-start-1',
                HelperMounts::local(),
                null,
                SecurityOptions::none(),
            )->mounts[0]->isWritable,
        );
    }

    public function test_a_contained_read_only_helper_mounts_the_mains_workspace_read_only_its_history_and_account(): void
    {
        $setting = ArrangementSetting::fromConfig('contained', 'acme', self::GIT_SOURCE);
        $account = new SelectedAccount(
            new RecordIdentity(Account::linkType(), '01m7y41pesrb3jvbxmhd5ssfer'),
            'claude-code',
            '/accounts/01b2',
            1,
        );

        $manifest = ContainerManifest::compile(
            'helper-1',
            self::IMAGE,
            '/ignored',
            WorkspaceUse::ReadOnly,
            $this->policy(),
            'acme-helper-1',
            $setting->mountRules($account, 'main', self::claudeMounts()),
            null,
            SecurityOptions::none(),
        );

        $this->assertEquals(
            [
                ManifestMount::volume('acme-workspace-main', '/workspace', false),
                ManifestMount::daemonBind('/srv/journal/accounts/01b2', '/home/journal/.account', true),
                ManifestMount::volume('acme-history-helper-1', '/home/journal/.account/projects', true),
                ManifestMount::planFiles('/tmp/journal-session'),
                ManifestMount::planFile('managed-settings.json', '/etc/claude-code/managed-settings.json'),
            ],
            $manifest->mounts,
        );
    }

    public function test_a_contained_writer_mounts_its_own_checkout_volume_and_has_it_made(): void
    {
        $setting = ArrangementSetting::fromConfig('contained', 'acme', self::GIT_SOURCE);

        $manifest = ContainerManifest::compile(
            'writer-1',
            self::IMAGE,
            '/ignored',
            WorkspaceUse::OwnCheckout,
            $this->policy(),
            'acme-writer-1',
            $setting->mountRules(null, 'main', self::claudeMounts()),
            null,
            SecurityOptions::none(),
        );
        $wire = $manifest->preparedBy([])->withPlanFilesIn('/srv/journal/sessions/writer-1/p1/files')->protocolData()->toArray();

        $this->assertSame(
            ['type' => 'volume', 'target' => '/workspace', 'isWritable' => true, 'source' => 'acme-checkout-writer-1'],
            $wire['mounts'][0],
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
            [['acme-history-writer-1', false], ['acme-checkout-writer-1', false]],
            array_map(fn (array $volume) => [$volume['name'], $volume['isAlreadyMade']], $wire['volumes']),
        );
        $this->assertTrue(
            HelperMounts::local()->workspaceMount('/workspaces/writer-1', WorkspaceUse::OwnCheckout, 'writer-1')->isWritable,
        );
    }

    public function test_a_parent_folder_a_credential_mount_a_mutable_tag_and_the_host_network_are_refused(): void
    {
        $workspace = [ManifestMount::bind('/workspaces/helper-7', '/workspace', true)];

        $this->assertRefused(
            fn () => ContainerManifest::make(
                self::IMAGE,
                'net',
                [ManifestMount::bind('/workspaces/helper-7/..', '/workspace', true)],
                ExecutionBudgets::defaults(),
                HelperMounts::local(),
                SecurityOptions::none(),
            ),
        );
        $this->assertRefused(
            fn () => ContainerManifest::make(
                self::IMAGE,
                'net',
                [ManifestMount::bind('/Users/me/.claude', '/workspace', true)],
                ExecutionBudgets::defaults(),
                HelperMounts::local(),
                SecurityOptions::none(),
            ),
        );
        $this->assertRefused(
            fn () => ContainerManifest::make(
                self::IMAGE,
                'net',
                [...$workspace, ManifestMount::bind('/var/run/docker.sock', '/var/run/docker.sock', true)],
                ExecutionBudgets::defaults(),
                HelperMounts::local(),
                SecurityOptions::none(),
            ),
        );
        $this->assertRefused(
            fn () => ContainerManifest::make(
                'registry.example/journal-helper:latest',
                'net',
                $workspace,
                ExecutionBudgets::defaults(),
                HelperMounts::local(),
                SecurityOptions::none(),
            ),
        );
        $this->assertRefused(
            fn () => ContainerManifest::make(
                self::IMAGE,
                'host',
                $workspace,
                ExecutionBudgets::defaults(),
                HelperMounts::local(),
                SecurityOptions::none(),
            ),
        );
    }

    public function test_a_contained_manifest_takes_its_volumes_account_and_profiles_and_goes_on_the_wire(): void
    {
        $manifest = $this->contained($this->containedMounts(), SecurityOptions::make(
            '/etc/journal/profiles/seccomp.json',
            'journal-agent',
            '/etc/journal/profiles',
        ));
        $wire = $manifest->protocolData()->toArray();

        $this->assertSame(
            [
                [
                    'type' => 'volume',
                    'target' => '/workspace',
                    'isWritable' => false,
                    'source' => 'acme-workspace-s1',
                ],
                [
                    'type' => 'daemon-bind',
                    'target' => '/home/journal/.account',
                    'isWritable' => true,
                    'source' => '/srv/journal/accounts/a1',
                ],
                [
                    'type' => 'volume',
                    'target' => '/home/journal/.account/projects',
                    'isWritable' => true,
                    'source' => 'acme-history-s1',
                ],
            ],
            $wire['mounts'],
        );
        $this->assertSame(
            ['seccomp' => '/etc/journal/profiles/seccomp.json', 'apparmor' => 'journal-agent'],
            $wire['securityOptions'],
        );
        $this->assertSame('size='.ExecutionBudgets::DEFAULT_HOME_BYTES, $wire['tmpfs'][2]['options']);
    }

    public function test_a_local_manifest_goes_on_the_wire_as_before_with_its_bind_type(): void
    {
        $manifest = ContainerManifest::compile(
            self::SESSION,
            self::IMAGE,
            self::WORKSPACE,
            WorkspaceUse::Shared,
            $this->policy(),
            'journal-start-1',
            HelperMounts::local(),
            null,
            SecurityOptions::none(),
        );

        $this->assertSame(
            [
                'type' => 'bind',
                'target' => '/workspace',
                'isWritable' => true,
                'source' => '/workspaces/helper-7',
            ],
            $manifest->protocolData()->toArray()['mounts'][0],
        );
    }

    public function test_an_image_loaded_from_a_saved_file_is_pinned_by_its_id(): void
    {
        $id = 'sha256:'.str_repeat('a', 64);
        $manifest = ContainerManifest::make(
            $id,
            'acme-s1',
            $this->containedMounts(),
            ExecutionBudgets::defaults(),
            HelperMounts::contained('acme', '/srv/journal/accounts/a1', new FolderWorkspace('main'), self::claudeMounts()),
            SecurityOptions::none(),
        );

        $this->assertSame($id, $manifest->image);
    }

    public function test_a_contained_start_on_an_account_binds_that_accounts_folder_and_nothing_else(): void
    {
        $setting = ArrangementSetting::fromConfig('contained', 'acme', '{"main":{"folder":"main"}}');
        $accountA = new SelectedAccount(
            new RecordIdentity(Account::linkType(), '01m7y41pesrb3jvbxmhd5ssfer'),
            'claude-code',
            '/accounts/01a1',
            1,
        );
        $accountB = new SelectedAccount(
            new RecordIdentity(Account::linkType(), '01m7y41pesrb3jvbxmhd5ssfer'),
            'claude-code',
            '/accounts/01b2',
            1,
        );

        $manifestOf = fn (SelectedAccount $account) => ContainerManifest::compile(
            self::SESSION,
            self::IMAGE,
            self::WORKSPACE,
            WorkspaceUse::Shared,
            $this->policy(),
            'acme-s1',
            $setting->mountRules($account, 'main', self::claudeMounts()),
            null,
            SecurityOptions::none(),
        );

        $this->assertEquals(
            [
                ManifestMount::daemonBind('/srv/journal/workspaces/main', '/workspace', true),
                ManifestMount::daemonBind('/srv/journal/accounts/01a1', '/home/journal/.account', true),
                ManifestMount::volume('acme-history-session-1', '/home/journal/.account/projects', true),
                ManifestMount::planFiles('/tmp/journal-session'),
                ManifestMount::planFile('managed-settings.json', '/etc/claude-code/managed-settings.json'),
            ],
            $manifestOf($accountA)->mounts,
        );
        $this->assertSame('/srv/journal/accounts/01b2', $manifestOf($accountB)->mounts[1]->source);
        $this->assertRefused(fn () => ContainerManifest::make(
            self::IMAGE,
            'acme-s1',
            [ManifestMount::daemonBind('/srv/journal/accounts/01b2', '/home/journal/.account', true)],
            ExecutionBudgets::defaults(),
            $setting->mountRules($accountA, 'main', self::claudeMounts()),
            SecurityOptions::none(),
        ));
    }

    public function test_an_account_folder_that_is_not_a_plain_id_is_refused_before_any_container(): void
    {
        $setting = ArrangementSetting::fromConfig('contained', 'acme', '{"main":{"folder":"main"}}');

        foreach (['/accounts/..', '/accounts/a1/../b2', '/accounts/A1', '/accounts/a-1'] as $directory) {
            $account = new SelectedAccount(
                new RecordIdentity(Account::linkType(), '01m7y41pesrb3jvbxmhd5ssfer'),
                'claude-code',
                $directory,
                1,
            );
            $this->assertThrows(fn () => $setting->mountRules($account, 'main', self::claudeMounts()), AccountFolderInvalid::class);
        }

        $this->assertEquals(HelperMounts::local(), ArrangementSetting::fromConfig('local', '', '{}')->mountRules(
            new SelectedAccount(
                new RecordIdentity(Account::linkType(), '01m7y41pesrb3jvbxmhd5ssfer'),
                'claude-code',
                '/Users/me/.journal/accounts/A1',
                1,
            ),
            'main',
            self::claudeMounts(),
        ));
    }

    public function test_a_contained_session_gets_its_own_history_and_a_resume_the_history_it_resumes(): void
    {
        $contained = HelperMounts::contained('acme', null, new FolderWorkspace('main'), self::claudeMounts());

        $this->assertSame([], HelperMounts::local()->sessionMounts('s1', null));
        $this->assertEquals(
            [
                ManifestMount::volume('acme-history-s1', '/home/journal/.account/projects', true),
                ManifestMount::planFiles('/tmp/journal-session'),
                ManifestMount::planFile('managed-settings.json', '/etc/claude-code/managed-settings.json'),
            ],
            $contained->sessionMounts('s1', null),
        );
        $this->assertNotEquals($contained->sessionMounts('s1', null), $contained->sessionMounts('s2', null));
        $this->assertEquals(
            [
                ManifestMount::volume('acme-history-s1', '/home/journal/.account/projects', true),
                ManifestMount::planFiles('/tmp/journal-session'),
                ManifestMount::planFile('managed-settings.json', '/etc/claude-code/managed-settings.json'),
            ],
            $contained->sessionMounts('s2', 's1'),
        );
        $this->assertSame(
            [['acme-history-s1', true]],
            array_map(
                fn ($volume) => [$volume->name, $volume->isAlreadyMade],
                $contained->sessionVolumes('s2', 's1', WorkspaceUse::Shared, 0),
            ),
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

        $this->assertRefused(fn () => SecurityOptions::make('unconfined,apparmor=unconfined', '', ''));
        $this->assertRefused(fn () => SecurityOptions::make('/tmp/seccomp.json', '', '/etc/journal/profiles'));
    }

    public function test_a_protected_start_runs_its_init_as_root_with_three_capabilities_and_says_so(): void
    {
        $manifest = $this->protected($this->containedMounts());
        $sent = $manifest->protocolData()->toArray();

        $this->assertSame(
            ['0:0', ['SETUID', 'SETGID', 'SETPCAP'], ['/opt/journal/bin/journal-init'], true, '/run/journal-exec', ['--', 'claude']],
            [
                $sent['user'],
                $sent['capabilities'],
                $sent['entrypoint'],
                $sent['blocksNewPrivileges'],
                $sent['tmpfs'][3]['target'],
                $manifest->startProfile->commandOf(['claude']),
            ],
        );
    }

    public function test_a_protected_start_with_no_account_is_refused(): void
    {
        $withoutAccount = array_values(array_filter(
            $this->containedMounts(),
            fn (ManifestMount $mount) => $mount->target !== '/home/journal/.account',
        ));

        $this->assertRefused(fn () => $this->protected($withoutAccount));
    }

    public function test_the_account_mount_points_are_the_folders_inside_the_account_mounted_over(): void
    {
        $this->assertSame(['projects'], $this->protected($this->containedMounts())->accountMountPoints());
    }

    public function test_the_plan_file_mounts_bind_the_folder_their_process_files_are_written_to(): void
    {
        $setting = ArrangementSetting::fromConfig('contained', 'acme', self::GIT_SOURCE);
        $manifest = ContainerManifest::compile(
            's1',
            self::IMAGE,
            '/ignored',
            WorkspaceUse::Shared,
            $this->policy(),
            'acme-s1',
            $setting->mountRules(null, 'main', self::claudeMounts()),
            null,
            SecurityOptions::none(),
        )->withPlanFilesIn('/srv/journal/sessions/s1/p1/files');

        $this->assertSame(
            [
                '/srv/journal/sessions/s1/p1/files',
                '/srv/journal/sessions/s1/p1/files/managed-settings.json',
            ],
            array_slice(array_column($manifest->protocolData()->toArray()['mounts'], 'source'), 2),
        );
    }

    /**
     * @param  list<ManifestMount>  $mounts
     */
    private function protected(array $mounts): ContainerManifest
    {
        return ContainerManifest::make(
            self::IMAGE,
            'acme-s1',
            $mounts,
            ExecutionBudgets::defaults(),
            HelperMounts::contained('acme', '/srv/journal/accounts/a1', new FolderWorkspace('main'), self::claudeMounts()),
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
            'acme-s1',
            $mounts,
            ExecutionBudgets::defaults(),
            HelperMounts::contained('acme', '/srv/journal/accounts/a1', new FolderWorkspace('main'), self::claudeMounts()),
            $securityOptions,
        );
    }

    private function assertRefused(\Closure $make): void
    {
        $this->assertThrows($make, ManifestRefused::class);
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

    public function test_a_contained_codex_session_mounts_no_plan_file_of_another_driver(): void
    {
        $codex = HelperMounts::contained('acme', null, new FolderWorkspace('main'), []);

        $this->assertSame(
            [],
            array_values(array_filter(
                $codex->sessionMounts('s1', null),
                fn (ManifestMount $mount) => $mount->target === self::POLICY_TARGET,
            )),
        );
    }

    /**
     * The plan files Claude Code's setup mounts in its contained session.
     *
     * @return list<ManifestMount>
     */
    private static function claudeMounts(): array
    {
        return [ManifestMount::planFile(self::POLICY_FILE, self::POLICY_TARGET)];
    }
}
