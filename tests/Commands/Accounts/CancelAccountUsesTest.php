<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\CancelAccountUses\CancelAccountUsesCommand;
use App\Contracts\Accounts\AccountUses;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Actors\IdentityLinks;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandTransaction;
use App\Events\Sessions\AccountUseChanged;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionProcess;
use App\Support\ActorContext;
use App\Support\RecordIdentity;
use App\Support\RegisterPendingStart;
use App\Support\StartSessions;
use App\Values\OwnerAuthority;
use App\Values\SelectedAccount;
use Illuminate\Database\Connection;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Links\Note;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Maintenance cancels the starts of an account that no host claimed yet, so they never make a process, and says the
 * account's use changed only when it cancelled one.
 */
final class CancelAccountUsesTest extends TestCase
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

    public function test_only_the_unclaimed_starts_are_cancelled_and_a_second_cancel_finds_none(): void
    {
        $account = $this->account();
        $claimed = $this->sessionOn($account);
        $pending = $this->sessionOn($account);
        $this->assertTrue($this->starts[$claimed->id]->claim());
        Event::fake([AccountUseChanged::class]);

        $first = $this->bus()->run(new CancelAccountUsesCommand($account));
        $second = $this->bus()->run(new CancelAccountUsesCommand($account));

        $this->assertSame([1, 0], [$first, $second]);
        $this->assertFalse($this->starts[$pending->id]->refresh()->claim());
        Event::assertDispatchedTimes(AccountUseChanged::class, 1);
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
            ActorContext::forUser(TestIds::of(1)),
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
