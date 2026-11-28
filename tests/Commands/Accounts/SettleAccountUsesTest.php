<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Access\Values\OwnerAuthority;
use App\Accounts\Commands\CancelAccountUses\CancelAccountUsesCommand;
use App\Accounts\Commands\HoldAccountUses\HoldAccountUsesCommand;
use App\Accounts\Commands\SettleAccountUses\SettleAccountUsesCommand;
use App\Accounts\Contracts\AccountUses;
use App\Accounts\Exceptions\AccountInUse;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Contracts\IdentityLinks;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandTransaction;
use App\Events\Sessions\AccountUseChanged;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionProcess;
use App\Sessions\RegisterPendingStart;
use App\Sessions\StartSessions;
use App\Support\ActorReference;
use App\Support\RecordIdentity;
use App\Values\SelectedAccount;
use Carbon\CarbonImmutable;
use Illuminate\Database\Connection;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Links\Note;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Maintenance cancels the unclaimed starts of an account and settles only once the claimed ones exited.
 */
#[TestsCommand(SettleAccountUsesCommand::class)]
final class SettleAccountUsesTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'links',
        'session_processes',
        'command_receipts',
    ];

    /**
     * An account's link alias whose table this test never creates: linking and reading by identity must not load it.
     */
    private const string ACCOUNT_TYPE = 'fixtures.note';

    private Agent $agent;

    /**
     * @var array<string, SessionProcess>
     */
    private array $starts = [];

    protected function setUp(): void
    {
        parent::setUp();

        Relation::morphMap([self::ACCOUNT_TYPE => Note::class]);
        $this->agent = $this->journal->idleAgent('Test agent', 'main-agent')->agentCalled('Test agent');
        $this->actAsOwner();
    }

    public function test_maintenance_cancels_unclaimed_starts_and_settles_only_once_claimed_ones_ended(): void
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
            // An ending session ends its claimed start with it, so the account is free to settle.
            $claimed->endAt(CarbonImmutable::now());
            $this->assertSame(0, $this->uses()->counts([$account])->runningFor($account));
        }

        $this->bus()->run(new SettleAccountUsesCommand($account));

        Event::assertDispatchedTimes(AccountUseChanged::class, 3);
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

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }

    private function uses(): AccountUses
    {
        return $this->app->make(AccountUses::class);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
