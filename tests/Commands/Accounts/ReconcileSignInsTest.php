<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Commands\Accounts\ReconcileSignIns\ReconcileSignInsCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\SignInStatus;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\SignInAttempt;
use App\Support\ActorContext;
use App\Support\JournalCommands;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Bus;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A restarted runner ends only the sign-ins it lost.
 */
#[TimeLimit(seconds: 3, reason: 'It commits attempts through the bus and empties four tables per test.')]
#[TestsCommand(ReconcileSignInsCommand::class)]
final class ReconcileSignInsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['accounts', 'active_accounts', 'sign_in_attempts', 'command_receipts'];

    protected function setUp(): void
    {
        parent::setUp();

        Bus::fake([SignInDeadline::class]);
    }

    public function test_a_restarted_runner_ends_only_the_sign_ins_it_lost(): void
    {
        $lost = $this->begin('claude-code', 'host-a');
        $other = $this->begin('codex', 'host-b');

        $kept = $this->reconcile('host-a', [$lost]);
        $ended = $this->reconcile('host-a', []);

        $this->assertSame([0, 1], [$kept, $ended]);
        $attempt = SignInAttempt::query()->withoutGlobalScopes()->findOrFail($lost);
        $this->assertSame(SignInStatus::Interrupted, $attempt->status);
        $this->assertTrue($attempt->cleanup_pending);
        $this->assertSame(
            SignInStatus::Starting,
            SignInAttempt::query()->withoutGlobalScopes()->findOrFail($other)->status,
        );
    }

    private function begin(string $driver, string $hostId): string
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
        $begin = new BeginSignInCommand($driver, SignInMethod::OAuth);
        $attemptId = $this->journal->run($begin, "key-{$driver}")
            ->attemptId;
        $this->assertSame($attemptId, $this->claimSignIn($hostId, CarbonImmutable::now())?->id);

        return $attemptId;
    }

    /**
     * @param  list<string>  $running
     */
    private function reconcile(string $hostId, array $running): int
    {
        return $this->app->make(JournalCommands::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new ReconcileSignInsCommand($hostId, $running),
        );
    }

    private function claimSignIn(string $hostId, CarbonImmutable $now): SignInAttempt|null
    {
        $attempt = SignInAttempt::findOldestWaitingAt($now);
        $attempt?->claimOn($hostId);

        return $attempt;
    }
}
