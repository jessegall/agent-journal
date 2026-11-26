<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Accounts\Commands\BeginSignInAgain\BeginSignInAgainCommand;
use App\Accounts\Commands\CancelSignIn\CancelSignInCommand;
use App\Accounts\Commands\ReconcileAccounts\ReconcileAccountsCommand;
use App\Accounts\Commands\ReleaseSignInAgain\ReleaseSignInAgainCommand;
use App\Accounts\Enums\AccountProcessRole;
use App\Accounts\Enums\CommandEntry;
use App\Accounts\Enums\SignInStatus;
use App\Agents\Enums\SessionProcessStatus;
use App\Bus\Contracts\CommandBus;
use App\Bus\JournalCommands;
use App\Bus\ListenerRegistry;
use App\Events\Accounts\SignInAttemptFinished;
use App\Jobs\SignInDeadline;
use App\Listeners\ReleaseSignInWriter;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;
use Tests\Fixtures\Profiles\FailsAfterRelease;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A sign-in again waits for the account's uses and is released to the host only once every process on the account
 * ended.
 */
#[TimeLimit(seconds: 4, reason: 'It commits accounts, attempts and starts through the bus and empties seven tables.')]
#[TestsCommand(ReleaseSignInAgainCommand::class)]
final class ReleaseSignInAgainTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'users',
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'command_receipts',
        'links',
        'session_processes',
        'account_notices',
    ];

    private Account $account;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        Bus::fake([SignInDeadline::class]);
        $this->account = $this->chooseActiveAccounts()['codex'];
        $this->account->forceFill(['subject' => 'subject-1'])->save();
    }

    public function test_the_host_takes_it_only_after_the_accounts_processes_ended(): void
    {
        $this->startProcessOnAccount();
        $attemptId = $this->again('tab-1');

        $this->assertNull($this->claimSignIn('host', CarbonImmutable::now()));
        $this->reconcile();
        $this->assertNull($this->claimSignIn('host', CarbonImmutable::now()));

        DB::table('session_processes')->update(['status' => SessionProcessStatus::Stopped->value]);
        $this->reconcile();

        $this->assertSame($attemptId, $this->claimSignIn('host', CarbonImmutable::now())?->id);
    }

    public function test_a_failure_after_the_release_rolls_back_the_attempt_and_the_account(): void
    {
        $attemptId = $this->again('tab-1');
        $this->app->instance(ListenerRegistry::class, new ListenerRegistry([
            SignInAttemptFinished::class => [ReleaseSignInWriter::class.'@handle', FailsAfterRelease::class.'@handle'],
        ]));

        $this->assertThrows(fn () => $this->asOwner(new CancelSignInCommand($attemptId)), RuntimeException::class);

        $attempt = SignInAttempt::query()->withoutGlobalScopes()->findOrFail($attemptId);
        $this->assertNotSame(SignInStatus::Cancelled, $attempt->status);
        $this->assertSame($attemptId, $this->account->refresh()->live_writer_attempt_id);
    }

    private function again(string $requestKey): string
    {
        $this->journal->actAs('Owner');

        return $this->journal->run(new BeginSignInAgainCommand($this->account->id), $requestKey)
            ->attemptId;
    }

    private function reconcile(): void
    {
        $this->app->make(JournalCommands::class)
            ->runAsJournal(CommandEntry::AccountMaintenance, 'account reconciliation', new ReconcileAccountsCommand());
    }

    private function startProcessOnAccount(): void
    {
        DB::table('session_processes')->insert([
            'id' => strtolower((string) Str::ulid()),
            'agent_id' => strtolower((string) Str::ulid()),
            'session_id' => strtolower((string) Str::ulid()),
            'start_key' => (string) Str::ulid(),
            'account_type' => Account::linkType(),
            'account_id' => $this->account->id,
            'account_generation' => $this->account->sign_in_generation,
            'directory' => (string) $this->account->directory,
            'status' => SessionProcessStatus::Running->value,
            'role' => AccountProcessRole::Execution->value,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function claimSignIn(string $hostId, CarbonImmutable $now): SignInAttempt|null
    {
        $attempt = SignInAttempt::findOldestWaitingAt($now);
        $attempt?->claimOn($hostId);

        return $attempt;
    }

    private function asOwner(object $command): void
    {
        $this->journal->actAs('Owner');
        $this->app->make(CommandBus::class)->run($command);
    }
}
