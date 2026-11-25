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
use Tests\Support\OpensPairChats;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\WritesInboxMessages;
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
    use OpensPairChats;
    use RunsTrustedCommands;
    use SendsHostCalls;
    use WritesInboxMessages;

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

    /**
     * A setting change the host staged waits for a turn and counts as applied only on that turn's evidence: the model
     * its output names confirms a model change, while an effort change, which no output shows, stays unconfirmed.
     */
    /**
     * A host that could not start a turn, such as a prompt its screen did not let in, reports it staged and tries no
     * more: the journal takes the request back and offers it again once its wait has passed.
     */
    /**
     * The host reports a turn's end as it saw it; the journal judges a result marked an error as a failed turn.
     */
    /**
     * A turn that runs past the journal's limit is interrupted on the next engine pass, once, and its runtime held.
     */
    /**
     * The host reports plain facts and the journal chooses the hold: an account that is not signed in, and a stop the
     * host could not prove, each leave the runtime needing attention.
     */
    /**
     * The journal's hold is the only one: an interrupted runtime is offered no new work until a user releases it, and
     * then it is.
     */
    /**
     * A host keeps the runtime of every session it ever ran, so a claim reads only those with a request waiting, and
     * more than a page of their requests when they hold that many.
     */
    public function test_the_start_grant_is_handed_out_once(): void
    {
        [$host, $opened] = $this->openRuntime();

        $first = $this->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId));
        $second = $this->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId));

        $this->assertInstanceOf(StartGrant::class, $first);
        $this->assertNotSame('', $first->token);
        $this->assertNull($second);
    }

    public function test_the_start_grant_names_the_driver_registration_by_its_key(): void
    {
        [$host, $opened] = $this->openRuntime();
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);

        $grant = $this->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId));

        $key = $this->app->make(DriverCatalogue::class)->keyFor($runtime->family, $runtime->driver_type);
        $label = $this->app->make(DriverCatalogue::class)->forKey($key)->descriptor()->label;

        $this->assertSame([(string) $key, (string) $key, $label], [$grant->runtime->driverKey, $runtime->driver_key, $runtime->driver_label]);
    }

    public function test_a_start_grant_of_a_session_on_the_protected_host_carries_no_container(): void
    {
        [$host, $opened] = $this->openRuntime();

        $grant = $this->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId));

        $this->assertNull($grant->container);
        $this->assertNull($grant->toArray()['container']);
    }

    public function test_a_contained_main_sessions_grant_carries_its_attachable_container(): void
    {
        $account = Account::create(DefaultDrivers::CLAUDE_CODE, AccountLabel::from('Plain'), '/journal/accounts/01plain');
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
            new StartPolicy(ProfileBase::mainAgent()->defaultAccess(), new StopConditions([]), $execution, null, null, null),
        );

        $grant = $this->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId));
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
            new StartPolicy(ProfileBase::mainAgent()->defaultAccess(), new StopConditions([]), $execution, null, null, null),
        );

        $this->assertThrows(
            fn () => $this->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId)),
            AccountFolderInvalid::class,
        );
    }

    public function test_another_host_cannot_take_a_runtimes_start_grant(): void
    {
        [, $opened] = $this->openRuntime();
        $other = $this->enrollHost();

        $this->expectException(HostReportRefused::class);

        $this->asSystem(new ClaimStartGrantCommand($other->hostId, $opened->runtimeId));
    }

    /**
     * An idle runtime reports nothing between two turns, so its last report grew stale after a
     * minute and its session read as Status unknown though nothing was wrong.
     */
    /**
     * A page learns that a session's state changed from the host's report itself, so its header
     * never waits for a reload; a beat that only keeps a fresh report fresh says nothing.
     */
}
