<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Commands\Sessions\ClaimStartGrant\ClaimStartGrantCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Skills\SkillPublisher as SkillPublisherContract;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Skills\PublicationStatus;
use App\Exceptions\AccountFolderInvalid;
use App\Exceptions\HostReportRefused;
use App\Exceptions\StartRefused;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionPolicy;
use App\Models\Skills\SkillPublication;
use App\Support\ActorIdentity;
use App\Support\ArrangementSetting;
use App\Support\DefaultDrivers;
use App\Support\DomainRegistry;
use App\Support\OpenedRuntime;
use App\Support\SkillPublisher;
use App\Support\StartGrant;
use App\Values\AccountLabel;
use App\Values\ExecutionBudgets;
use App\Values\ExecutionPolicy;
use App\Values\OwnerAuthority;
use App\Values\ProfileBase;
use App\Values\ProfileStartPolicy;
use App\Values\StartPolicy;
use App\Values\StopConditions;
use Tests\Fixtures\Skills\FullDiskPublisher;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Skills\PublishesSkills;
use Tests\TestCase;

/**
 * A host claims a runtime's start grant once: it names the driver registration by its key, carries the attachable
 * container of a contained main session and none on the protected host, and is refused for an account folder that
 * is no plain id and to another host.
 */
#[TestsCommand(ClaimStartGrantCommand::class)]
final class ClaimStartGrantTest extends TestCase
{
    use CommitsHookRows;
    use HasContainerSupport;
    use OpensLedgerRuntimes;
    use PublishesSkills;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'links',
        'skill_publications',
        'skill_generations',
        'command_receipts',
        'profile_revisions',
        'profiles',
    ];

    private const string NO_SPACE = 'no space left';

    public function test_the_start_grant_is_handed_out_once(): void
    {
        [$host, $opened] = $this->openRuntime();

        $first = $this->journal->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId));
        $second = $this->journal->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId));

        $this->assertInstanceOf(StartGrant::class, $first);
        $this->assertNotSame('', $first->token);
        $this->assertNull($second);
    }

    public function test_the_start_grant_names_the_driver_registration_by_its_key(): void
    {
        [$host, $opened] = $this->openRuntime();
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);

        $grant = $this->journal->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId));

        $key = $this->app->make(DriverCatalogue::class)->keyFor($runtime->family, $runtime->driver_type);
        $label = $this->app->make(DriverCatalogue::class)->forKey($key)->descriptor()->label;

        $this->assertSame(
            [(string) $key, (string) $key, $label],
            [$grant->runtime->driverKey, $runtime->driver_key, $runtime->driver_label],
        );
    }

    public function test_a_start_grant_of_a_session_on_the_protected_host_carries_no_container(): void
    {
        [$host, $opened] = $this->openRuntime();

        $grant = $this->journal->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId));

        $this->assertNull($grant->container);
        $this->assertNull($grant->toArray()['container']);
    }

    public function test_a_contained_main_sessions_grant_carries_its_attachable_container(): void
    {
        $account = Account::create(
            DefaultDrivers::CLAUDE_CODE,
            AccountLabel::from('Plain'),
            '/journal/accounts/01plain',
        );
        ActiveAccount::findLockedFor(DefaultDrivers::CLAUDE_CODE)->select($account);
        [$host, $opened] = $this->openRuntime();
        // The driver runs in a terminal of its own, which is what makes a main session's container attachable.
        AgentRuntime::query()->findOrFail($opened->runtimeId)->forceFill(['has_screen' => true])->save();
        $this->app->instance(
            ArrangementSetting::class,
            ArrangementSetting::fromConfig('contained', 'acme', '{"main":{"folder":"main"}}'),
        );
        $image = 'journal-agent@sha256:'.str_repeat('a', 64);
        $execution = new ExecutionPolicy(
            ExecutionModeType::RequiredContainer,
            $image,
            ProfileStartPolicy::WORKSPACE,
            ExecutionBudgets::mainAgent(),
            [],
            ProfileBase::mainAgent()->isAttachable(),
        );
        SessionPolicy::query()->where('session_id', $opened->sessionId)->delete();
        SessionPolicy::create(
            AgentSession::query()->findOrFail($opened->sessionId),
            new StartPolicy(
                ProfileBase::mainAgent()->defaultAccess(),
                new StopConditions([]),
                $execution,
                null,
                null,
                null,
            ),
        );

        $grant = $this->journal->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId));
        $manifest = $grant->container;

        $this->assertNotNull($manifest);
        $this->assertTrue($manifest->isAttachable);
        $this->assertSame($image, $manifest->image);
        $this->assertSame("acme-{$opened->sessionId}", $manifest->network);
        $this->assertSame(
            [
                '/srv/journal/workspaces/main',
                '/srv/journal/accounts/01plain',
                "acme-history-{$opened->sessionId}",
                "/srv/journal/sessions/{$opened->sessionId}",
                "/srv/journal/sessions/{$opened->sessionId}/managed/managed-settings.json",
            ],
            array_map(fn ($mount) => $mount->source, $manifest->mounts),
        );
        $this->assertTrue($manifest->mounts[0]->isWritable);
        $wire = json_decode(json_encode($grant->toArray(), JSON_THROW_ON_ERROR), true, 512, JSON_THROW_ON_ERROR);
        $this->assertTrue($wire['container']['isAttachable']);
        $this->assertSame('daemon-bind', $wire['container']['mounts'][0]['type']);
    }

    public function test_a_contained_session_whose_account_folder_is_no_plain_id_gets_no_grant(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->app->instance(
            ArrangementSetting::class,
            ArrangementSetting::fromConfig('contained', 'acme', '{"main":{"folder":"main"}}'),
        );
        $execution = new ExecutionPolicy(
            ExecutionModeType::RequiredContainer,
            'journal-agent@sha256:'.str_repeat('a', 64),
            ProfileStartPolicy::WORKSPACE,
            ExecutionBudgets::mainAgent(),
            [],
            true,
        );
        SessionPolicy::query()->where('session_id', $opened->sessionId)->delete();
        SessionPolicy::create(
            AgentSession::query()->findOrFail($opened->sessionId),
            new StartPolicy(
                ProfileBase::mainAgent()->defaultAccess(),
                new StopConditions([]),
                $execution,
                null,
                null,
                null,
            ),
        );

        $this->assertThrows(
            fn () => $this->journal->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId)),
            AccountFolderInvalid::class,
        );
    }

    public function test_another_host_cannot_take_a_runtimes_start_grant(): void
    {
        [, $opened] = $this->openRuntime();
        $other = $this->enrollHost();

        $this->expectException(HostReportRefused::class);

        $this->journal->asSystem(new ClaimStartGrantCommand($other->hostId, $opened->runtimeId));
    }

    public function test_a_codex_start_gets_its_set_written_before_spawn_and_records_the_generation(): void
    {
        $this->journal->installProfiles();

        [$host, $opened] = $this->openCodexRuntime();
        $publication = SkillPublication::findLatestOfSession($opened->sessionId);

        $this->assertNotNull($publication);
        $this->assertSame(PublicationStatus::Delivered, $publication->status);
        $this->assertFileExists("{$this->root}/targets/{$opened->sessionId}/codex/journal/SKILL.md");

        $grant = $this->journal->asSystem(new ClaimStartGrantCommand($host, $opened->runtimeId));

        $this->assertInstanceOf(StartGrant::class, $grant);
        $this->assertCount(1, $grant->folders);
        $this->assertSame('skills', $grant->folders[0]->name);
        $this->assertSame([], $grant->folders[0]->arguments);
        $this->assertContains('journal/SKILL.md', array_map(fn ($file) => $file->path, $grant->folders[0]->files));
        $this->assertSame($publication->generation_id, AgentSession::findById($opened->sessionId)->skill_generation_id);
    }

    public function test_a_failed_set_refuses_the_grant_so_nothing_spawns(): void
    {
        $this->journal->installProfiles();

        $this->app->instance(
            SkillPublisherContract::class,
            new FullDiskPublisher($this->app->make(SkillPublisher::class)),
        );
        [$host, $opened] = $this->openCodexRuntime();

        $this->expectException(StartRefused::class);
        $this->expectExceptionMessage(self::NO_SPACE);

        $this->journal->asSystem(new ClaimStartGrantCommand($host, $opened->runtimeId));
    }

    /**
     * @return array{0: string, 1: OpenedRuntime}
     */
    private function openCodexRuntime(): array
    {
        $host = $this->journal->asSystem(new EnrollHostCommand('test host', [self::FOLDER]));
        $agent = Agent::create('Codex agent', 'main-agent', $this->localProject());
        $this->app->make(CurrentActorSetter::class)->set(ActorIdentity::forUser('owner'), new OwnerAuthority('test'));
        $opened = $this->app->make(CommandBus::class)->run(new OpenAgentRuntimeCommand(
            $agent->id,
            $host->hostId,
            self::FOLDER,
            'codex',
            '0.165.0',
            'codex',
            DriverType::Headless,
            'gpt-5.5',
        ));

        return [$host->hostId, $opened];
    }

    /**
     * Every installed domain, since the skills this test names come from them.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }
}
