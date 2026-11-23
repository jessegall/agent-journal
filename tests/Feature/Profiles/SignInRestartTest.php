<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\BeginSignIn\BeginSignInCommand;
use App\Commands\ReconcileSignIns\ReconcileSignInsCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Files\Files;
use App\Enums\CommandEntry;
use App\Enums\SignInMethod;
use App\Enums\SignInState;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\SignInAttempt;
use App\Support\ActorContext;
use App\Support\EntryDispatchers;
use App\Support\LocalAccountFolders;
use App\Support\PrivateSignInProcesses;
use App\Support\SignInProtocols;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Bus;
use Tests\Fixtures\Profiles\RecordingSignInHost;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * After a restart the host's runner says it runs no sign-in: the attempts it took end as interrupted at once, a new
 * account's folder is owed its cleanup, and another host's attempts and the one it still runs are left alone.
 */
#[TimeLimit(seconds: 3, reason: 'It commits attempts through the bus and empties four tables per test.')]
final class SignInRestartTest extends TestCase
{
    use CommitsHookRows;
    use RunsKeyedCommands;

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
        $this->assertSame(SignInState::Interrupted, $attempt->state);
        $this->assertTrue($attempt->cleanup_pending);
        $this->assertSame(
            SignInState::Starting,
            SignInAttempt::query()->withoutGlobalScopes()->findOrFail($other)->state,
        );
    }

    public function test_the_runner_reports_at_start_that_it_runs_nothing(): void
    {
        $host = new RecordingSignInHost(null);

        new PrivateSignInProcesses($host, new SignInProtocols($this->app), static fn () => null, $this->app->make(Files::class), new LocalAccountFolders($this->app->make(Files::class)))->reconcileAtStart();

        $this->assertSame([[]], $host->reconciled);
    }

    private function begin(string $driver, string $hostId): string
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
        $begin = new BeginSignInCommand($driver, SignInMethod::OAuth);
        $attemptId = $this->runOnBus($begin, "key-{$driver}")
            ->attemptId;
        $this->assertSame($attemptId, $this->claimSignIn($hostId, CarbonImmutable::now())?->id);

        return $attemptId;
    }

    /**
     * @param  list<string>  $running
     */
    private function reconcile(string $hostId, array $running): int
    {
        return $this->app->make(EntryDispatchers::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new ReconcileSignInsCommand($hostId, $running),
        );
    }

    private function claimSignIn(string $hostId, CarbonImmutable $now): SignInAttempt|null
    {
        $attempt = SignInAttempt::oldestWaitingAt($now);
        $attempt?->claimOn($hostId);

        return $attempt;
    }
}
