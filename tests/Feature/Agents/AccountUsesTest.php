<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Actions\RegisterPendingStart;
use App\Agents\Actions\StartSessions;
use App\Agents\Commands\CancelAccountUses\CancelAccountUsesCommand;
use App\Agents\Commands\HoldAccountUses\HoldAccountUsesCommand;
use App\Agents\Commands\SettleAccountUses\SettleAccountUsesCommand;
use App\Agents\Contracts\AccountUses;
use App\Agents\Contracts\ActiveAccountReader;
use App\Agents\Enums\AccountProcessRole;
use App\Agents\Enums\StartUnavailableReason;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Exceptions\AccountInUse;
use App\Agents\Exceptions\AccountUnavailable;
use App\Agents\Exceptions\AccountUseMissing;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ProcessStart;
use App\Agents\Resolvers\UnconfiguredAccounts;
use App\Agents\Values\AccountUse;
use App\Agents\Values\SelectedAccount;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandTransaction;
use App\Bus\Exceptions\CommandTransactionMissing;
use App\Drivers\Enums\HookDriver;
use App\Links\Exceptions\UnknownLinkType;
use App\Links\Support\LinkTypeRegistry;
use App\Profiles\Resolvers\ActiveAccountRecords;
use App\Records\Contracts\IdentityLinks;
use App\Records\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Connection;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Links\Note;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * A start's session links to the account it ran with by the account's identity alone, and Core answers how the
 * accounts are used and holds and settles their starts for maintenance, for the owner only.
 */
final class AccountUsesTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'links',
        'process_starts',
        'command_receipts',
    ];

    /**
     * An account's link alias whose table this test never creates: linking and reading by identity must not load it.
     */
    private const string ACCOUNT_TYPE = 'fixtures.note';

    private Agent $agent;

    /**
     * @var array<string, ProcessStart>
     */
    private array $starts = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(LinkTypeRegistry::class)->register([self::ACCOUNT_TYPE => Note::class]);
        $this->agent = Agent::create('Test agent', 'main-agent');
        $this->actAsOwner();
    }

    public function test_a_session_links_to_an_account_named_only_by_identity_and_reads_it_back(): void
    {
        $account = $this->account();
        $session = $this->sessionOn($account);
        $this->sessionOn($account);

        $this->assertTrue($this->uses()->accountOf($session->id, self::ACCOUNT_TYPE)->isSameAs($account));
        $linked = $this->links()->linkedOfType($session, self::ACCOUNT_TYPE);
        $this->assertSame([$account->id], array_map(fn (RecordIdentity $identity) => $identity->id, $linked));
    }

    public function test_linking_outside_a_bus_command_or_to_an_unregistered_alias_is_refused(): void
    {
        $session = $this->start();

        try {
            $this->links()->link($session, $this->account());
            $this->fail('A link was written outside a bus command.');
        } catch (CommandTransactionMissing) {
            $this->passCommandTransaction();
        }

        $this->expectException(UnknownLinkType::class);

        $this->links()->link($session, new RecordIdentity('fixtures.unknown', (string) Str::ulid()));
    }

    public function test_counts_and_history_follow_running_and_ended_starts_of_each_account(): void
    {
        [$first, $second, $unused] = [$this->account(), $this->account(), $this->account()];
        $ended = $this->sessionOn($first);
        $running = $this->sessionOn($first);
        $this->sessionOn($second);
        $ended->endAt(CarbonImmutable::now());
        $this->starts[$ended->id]->stopWithProof();

        $counts = $this->uses()->counts([$first, $second, $unused]);
        $history = $this->uses()->history($first, 10);

        $this->assertSame(
            [1, 1, 0],
            array_map(fn (RecordIdentity $account) => $counts->runningFor($account), [$first, $second, $unused]),
        );
        $this->assertSame([$running->id, $ended->id], array_map(fn (AccountUse $use) => $use->sessionId, $history));
        $this->assertSame([true, false], array_map(fn (AccountUse $use) => $use->isRunning(), $history));
        $this->assertSame(AccountProcessRole::Execution, $history[0]->role);
        $this->assertTrue($this->uses()->counts([$unused])->isEmpty());
    }

    public function test_a_session_without_an_account_names_what_is_missing(): void
    {
        $this->expectException(AccountUseMissing::class);

        $this->uses()->accountOf($this->start()->id, self::ACCOUNT_TYPE);
    }

    public function test_an_agent_may_neither_read_nor_maintain_account_uses(): void
    {
        $account = $this->account();
        $this->actAsAgent();

        $this->assertRefused(fn () => $this->uses()->counts([$account]));
        $this->assertRefused(fn () => $this->uses()->history($account, 10));
        $this->assertRefused(fn () => $this->bus()->run(new HoldAccountUsesCommand($account)));
    }

    public function test_maintenance_cancels_unclaimed_starts_and_settles_only_once_claimed_ones_exited(): void
    {
        $account = $this->account();
        $claimed = $this->sessionOn($account);
        $pending = $this->sessionOn($account);
        $this->assertTrue($this->starts[$claimed->id]->claim());
        Event::fake([AccountUseChanged::class]);

        $held = $this->bus()->run(new HoldAccountUsesCommand($account));
        $cancelled = $this->bus()->run(new CancelAccountUsesCommand($account));

        $this->assertSame([$claimed->id, $pending->id], $held->sessionIds);
        $this->assertSame(1, $cancelled);
        $this->assertFalse($this->starts[$pending->id]->refresh()->claim());

        try {
            $this->bus()->run(new SettleAccountUsesCommand($account));
            $this->fail('An account with a claimed start was settled.');
        } catch (AccountInUse) {
            $claimed->endAt(CarbonImmutable::now());
            $this->assertSame(1, $this->uses()->counts([$account])->runningFor($account));
            $this->starts[$claimed->id]->stopWithProof();
        }

        $this->bus()->run(new SettleAccountUsesCommand($account));

        Event::assertDispatchedTimes(AccountUseChanged::class, 3);
    }

    public function test_without_accounts_every_start_is_refused_with_its_program_and_a_safe_reason(): void
    {
        $this->assertInstanceOf(ActiveAccountRecords::class, $this->app->make(ActiveAccountReader::class));

        try {
            new UnconfiguredAccounts()->forStart(HookDriver::ClaudeCode);
            $this->fail('Core alone gave a start an account.');
        } catch (AccountUnavailable $refused) {
            $this->assertSame('claude-code', $refused->driver);
            $this->assertSame(StartUnavailableReason::NoAccount, $refused->reason);
        }
    }

    private function account(): RecordIdentity
    {
        return new RecordIdentity(self::ACCOUNT_TYPE, (string) Str::ulid());
    }

    private function start(): AgentSession
    {
        return $this->app->make(StartSessions::class)
            ->start($this->agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
    }

    private function sessionOn(RecordIdentity $account): AgentSession
    {
        $session = $this->start();
        $this->passCommandTransaction();
        $selected = new SelectedAccount($account, 'claude-code', '/journal/accounts/test', 1);
        $this->starts[$session->id] = $this->app->make(RegisterPendingStart::class)->register($session, $selected);

        return $session;
    }

    /**
     * The bus's own transaction check is proved by its tests; here the link is written as a start command would.
     */
    private function passCommandTransaction(): void
    {
        $this->app->instance(CommandTransaction::class, new class implements CommandTransaction
        {
            public function assertRunning(Connection $connection): void {}
        });
        $this->app->forgetInstance(IdentityLinks::class);
    }

    private function assertRefused(callable $read): void
    {
        try {
            $read();
            $this->fail('An agent read or changed the uses of an account.');
        } catch (ActorNotAllowed) {
            $this->addToAssertionCount(1);
        }
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }

    private function actAsAgent(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($this->agent->id),
            TestStartAuthority::forAgent($this->agent->id),
        );
    }

    private function uses(): AccountUses
    {
        return $this->app->make(AccountUses::class);
    }

    private function links(): IdentityLinks
    {
        return $this->app->make(IdentityLinks::class);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
