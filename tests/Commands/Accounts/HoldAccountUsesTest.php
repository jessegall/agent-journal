<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\HoldAccountUses\HoldAccountUsesCommand;
use App\Contracts\Accounts\AccountUses;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\ActorNotAllowed;
use App\Models\Agents\Agent;
use App\Models\Sessions\SessionProcess;
use App\Support\ActorContext;
use App\Support\RecordIdentity;
use App\Values\OwnerAuthority;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Str;
use Tests\Fixtures\Links\Note;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * An agent may neither read nor maintain account uses.
 */
#[TestsCommand(HoldAccountUsesCommand::class)]
final class HoldAccountUsesTest extends TestCase
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

    public function test_an_agent_may_neither_read_nor_maintain_account_uses(): void
    {
        $account = $this->account();
        $this->actAsAgent();

        $this->assertRefused(fn () => $this->uses()->counts([$account]));
        $this->assertRefused(fn () => $this->uses()->history($account, 10));
        $this->assertRefused(fn () => $this->bus()->run(new HoldAccountUsesCommand($account)));
    }

    private function account(): RecordIdentity
    {
        return new RecordIdentity(self::ACCOUNT_TYPE, (string) Str::ulid());
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

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
