<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Commands\Sessions\ClaimStartGrant\ClaimStartGrantCommand;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\Agents\ExecutionModeType;
use App\Exceptions\AccountFolderInvalid;
use App\Exceptions\HostReportRefused;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionPolicy;
use App\Support\ArrangementSetting;
use App\Support\DefaultDrivers;
use App\Support\StartGrant;
use App\Values\AccountLabel;
use App\Values\ExecutionBudgets;
use App\Values\ExecutionPolicy;
use App\Values\ProfileBase;
use App\Values\ProfileStartPolicy;
use App\Values\StartPolicy;
use App\Values\StopConditions;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * A host claims a runtime's start grant once: it names the driver registration by its key, carries the attachable
 * container of a contained main session and none on the protected host, and is refused for an account folder that
 * is no plain id and to another host.
 */
final class ClaimStartGrantTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;

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
    ];

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
}
