<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\ClaimCleanup\ClaimCleanupCommand;
use App\Commands\Accounts\CleanAccount\CleanAccountCommand;
use App\Commands\Accounts\ReconcileAccounts\ReconcileAccountsCommand;
use App\Commands\Accounts\RemoveAccount\RemoveAccountCommand;
use App\Commands\Accounts\RetryAccountCleanup\RetryAccountCleanupCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\Accounts\CleanupProblem;
use App\Enums\Accounts\CommandEntry;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\Account;
use App\Support\ActorReference;
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
 * A cleanup out of tries waits for the owner's retry in the same generation.
 */
#[TimeLimit(seconds: 4, reason: 'It commits accounts, attempts and starts through the bus and empties seven tables.')]
#[TestsCommand(RetryAccountCleanupCommand::class)]
final class RetryAccountCleanupTest extends TestCase
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

    public function test_a_cleanup_out_of_tries_waits_for_the_owners_retry_in_the_same_generation(): void
    {
        $this->asOwner(new RemoveAccountCommand($this->account->id));
        $this->reconcile();
        $generation = $this->account->refresh()->sign_in_generation;

        foreach (range(1, CleanupProgress::MOST_TRIES) as $try) {
            $this->clean($generation, false, true);
        }

        $this->assertNull($this->asHost(new ClaimCleanupCommand('host')));
        $this->assertTrue($this->account->refresh()->awaitsCleanupRetry());
        $this->assertSame(CleanupProblem::SignInNotVerified, $this->account->cleanup_problem);

        $this->asOwner(new RetryAccountCleanupCommand($this->account->id));

        $this->assertSame($generation, $this->asHost(new ClaimCleanupCommand('host'))?->generation);
    }

    private function clean(int $generation, bool $isStoreRemoved, bool $isDirectoryRemoved): void
    {
        $progress = new CleanupProgress($isStoreRemoved, $isDirectoryRemoved);
        $this->asHost(new CleanAccountCommand('host', $this->account->id, $generation, $progress));
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

    private function reconcile(): void
    {
        $this->app->make(JournalCommands::class)
            ->runAsJournal(CommandEntry::AccountMaintenance, 'account reconciliation', new ReconcileAccountsCommand());
    }
}
