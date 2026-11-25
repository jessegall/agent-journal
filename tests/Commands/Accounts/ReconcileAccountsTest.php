<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignInAgain\BeginSignInAgainCommand;
use App\Commands\Accounts\ReconcileAccounts\ReconcileAccountsCommand;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Accounts\SignInStatus;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\SignInAttempt;
use App\Support\JournalCommands;
use Illuminate\Support\Facades\Bus;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The sweep ends an overdue attempt, and signing in again holds the folder once.
 */
#[TimeLimit(seconds: 3, reason: 'It commits attempts and accounts through the bus and empties five tables per test.')]
#[TestsCommand(ReconcileAccountsCommand::class)]
final class ReconcileAccountsTest extends TestCase
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
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        Bus::fake([SignInDeadline::class]);
        $this->journal->actAs('Owner');
    }

    public function test_the_sweep_ends_an_overdue_attempt_and_signing_in_again_holds_the_folder_once(): void
    {
        $account = $this->chooseActiveAccounts()['codex'];
        $this->journal->actAs('Owner');
        $again = $this->journal->run(new BeginSignInAgainCommand($account->id), 'request-again');
        $rejoined = $this->journal->run(new BeginSignInAgainCommand($account->id), 'request-other');

        $this->assertSame($again->attemptId, $rejoined->attemptId);
        $this->assertSame($again->attemptId, $account->refresh()->live_writer_attempt_id);
        $this->travel(16)->minutes();

        $ended = $this->app->make(JournalCommands::class)
            ->runAsJournal(CommandEntry::AccountMaintenance, 'test sweep', new ReconcileAccountsCommand());

        $this->assertSame(1, $ended);
        $this->assertSame(SignInStatus::Expired, SignInAttempt::query()->whereKey($again->attemptId)->sole()->status);
        $this->assertNull($account->refresh()->live_writer_attempt_id);
    }
}
