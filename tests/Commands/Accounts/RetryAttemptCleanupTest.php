<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Commands\Accounts\CancelSignIn\CancelSignInCommand;
use App\Commands\Accounts\ClaimCleanup\ClaimCleanupCommand;
use App\Commands\Accounts\CleanSignInAttempt\CleanSignInAttemptCommand;
use App\Commands\Accounts\RetryAttemptCleanup\RetryAttemptCleanupCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Accounts\SignInMethod;
use App\Http\Pages\Resolvers\AccountsWindowResolver;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\Account;
use App\Support\ActorContext;
use App\Support\Command;
use App\Support\JournalCommands;
use App\Values\CleanupProgress;
use App\Values\OwnerAuthority;
use Illuminate\Support\Facades\Bus;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The owner retries an unfinished sign-in's cleanup by its attempt.
 */
#[TimeLimit(seconds: 4, reason: 'It commits accounts, attempts and starts through the bus and empties seven tables.')]
#[TestsCommand(RetryAttemptCleanupCommand::class)]
final class RetryAttemptCleanupTest extends TestCase
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
        config(['accounts.root' => sys_get_temp_dir()]);

        Bus::fake([SignInDeadline::class]);
        $this->account = $this->chooseActiveAccounts()['codex'];
    }

    public function test_the_owner_retries_an_unfinished_sign_ins_cleanup_by_its_attempt(): void
    {
        $started = $this->asOwner(new BeginSignInCommand('claude-code', SignInMethod::OAuth));
        $this->asOwner(new CancelSignInCommand($started->attemptId));

        foreach (range(1, CleanupProgress::MOST_TRIES) as $try) {
            $this->asHost(new CleanSignInAttemptCommand('host', $started->attemptId, new CleanupProgress(false, true)));
        }

        $this->assertNull($this->asHost(new ClaimCleanupCommand('host')));
        $listed = $this->app->make(AccountsWindowResolver::class)->list()->pendingCleanups;
        $this->assertSame([$started->attemptId, true], [$listed[0]->attemptId, $listed[0]->awaitsRetry]);

        $this->asOwner(new RetryAttemptCleanupCommand($started->attemptId));

        $this->assertSame($started->attemptId, $this->asHost(new ClaimCleanupCommand('host'))?->id);
    }

    private function asOwner(Command $command): mixed
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
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
