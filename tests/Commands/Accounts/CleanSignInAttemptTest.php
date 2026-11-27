<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Access\Values\OwnerAuthority;
use App\Accounts\Commands\BeginSignIn\BeginSignInCommand;
use App\Accounts\Commands\CancelSignIn\CancelSignInCommand;
use App\Accounts\Commands\ClaimCleanup\ClaimCleanupCommand;
use App\Accounts\Commands\CleanSignInAttempt\CleanSignInAttemptCommand;
use App\Accounts\Enums\CleanupProblem;
use App\Accounts\Enums\CleanupTarget;
use App\Accounts\Enums\CommandEntry;
use App\Accounts\Enums\SignInMethod;
use App\Accounts\Values\CleanupProgress;
use App\Actors\Contracts\CurrentActorSetter;
use App\Bus\JournalCommands;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use App\Support\ActorReference;
use App\Support\Command;
use Illuminate\Support\Facades\Bus;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * An unfinished new account's sign-in is cleaned with both proofs, and a folder still in use counts no try and says so.
 */
#[TimeLimit(seconds: 4, reason: 'It commits accounts, attempts and starts through the bus and empties seven tables.')]
#[TestsCommand(CleanSignInAttemptCommand::class)]
final class CleanSignInAttemptTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'account_usage_windows',
        'account_usage_costs',
        'account_usage_tokens',
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

        // The account folders of this test lie in the system's temporary folder, so the accounts root is that folder.
        config(['journal.accounts.root' => sys_get_temp_dir()]);

        Bus::fake([SignInDeadline::class]);
        $this->account = $this->chooseActiveAccounts()['codex'];
    }

    public function test_an_unfinished_new_accounts_sign_in_is_cleaned_with_both_proofs(): void
    {
        $started = $this->asOwner(new BeginSignInCommand('claude-code', SignInMethod::OAuth));
        $this->asOwner(new CancelSignInCommand($started->attemptId));

        $claimed = $this->asHost(new ClaimCleanupCommand('host'));
        $this->assertSame([CleanupTarget::SignInAttempt, $started->attemptId], [$claimed?->target, $claimed?->id]);

        $this->asHost(new CleanSignInAttemptCommand('host', $started->attemptId, new CleanupProgress(true, true)));

        $this->assertFalse(SignInAttempt::query()->withoutGlobalScopes()->sole()->cleanup_pending);
        $this->assertNull($this->asHost(new ClaimCleanupCommand('host')));
    }

    public function test_a_folder_still_in_use_counts_no_try_and_says_so(): void
    {
        $started = $this->asOwner(new BeginSignInCommand('claude-code', SignInMethod::OAuth));
        $this->asOwner(new CancelSignInCommand($started->attemptId));

        foreach (range(1, CleanupProgress::MOST_TRIES + 1) as $try) {
            $this->asHost(new CleanSignInAttemptCommand('host', $started->attemptId, CleanupProgress::stillBound()));
        }

        $attempt = SignInAttempt::query()->withoutGlobalScopes()->sole();
        $this->assertSame([0, CleanupProblem::StillBound], [$attempt->cleanup_tries, $attempt->cleanup_problem]);
        $this->assertSame($started->attemptId, $this->asHost(new ClaimCleanupCommand('host'))?->id);
    }

    private function asOwner(Command $command): mixed
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );

        return $this->journal->run($command);
    }

    private function asHost(Command $command): mixed
    {
        return $this->app->make(JournalCommands::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            $command,
        );
    }
}
