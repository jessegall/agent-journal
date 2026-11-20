<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Enums\AccountProcessRole;
use App\Agents\Enums\ProcessStartState;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Bus\Support\EntryDispatchers;
use App\Profiles\Commands\BeginSignIn;
use App\Profiles\Commands\BeginSignInAgain;
use App\Profiles\Commands\CancelSignIn;
use App\Profiles\Commands\ClaimCleanup;
use App\Profiles\Commands\CleanAccount;
use App\Profiles\Commands\CleanSignInAttempt;
use App\Profiles\Commands\ReconcileAccounts;
use App\Profiles\Commands\RemoveAccount;
use App\Profiles\Commands\RetryAccountCleanup;
use App\Profiles\Commands\RetryAttemptCleanup;
use App\Profiles\Contracts\AccountOwnerDrain;
use App\Profiles\Enums\AccountState;
use App\Profiles\Enums\CleanupProblem;
use App\Profiles\Enums\CleanupTarget;
use App\Profiles\Enums\SignInState;
use App\Profiles\Jobs\SignInDeadline;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Resolvers\AccountsWindowResolver;
use App\Profiles\Support\PrivateSignInProcesses;
use App\Profiles\Support\SignInProtocols;
use App\Profiles\Values\AccountLabel;
use App\Profiles\Values\ClaimedCleanup;
use App\Profiles\Values\CleanupProgress;
use App\Programs\Enums\HookProgram;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Fixtures\Profiles\FinishingProtocol;
use Tests\Fixtures\Profiles\RecordingSignInHost;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * Removing an account is one operation in a new generation: it leaves the choice without a replacement, waits for
 * every process on the account, and ends only when the host proved both the sign-in store and the folder gone; the
 * row and its label stay.
 */
#[TimeLimit(seconds: 4, reason: 'It commits accounts, attempts and starts through the bus and empties seven tables.')]
final class AccountRemovalTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'command_receipts',
        'links',
        'process_starts',
        'account_notices',
    ];

    private Account $account;

    protected function setUp(): void
    {
        parent::setUp();

        Bus::fake([SignInDeadline::class]);
        $this->account = $this->chooseActiveAccounts()['codex'];
    }

    public function test_removal_cancels_a_running_sign_in_and_leaves_no_replacement_chosen(): void
    {
        Account::signedIn(HookProgram::Codex, AccountLabel::from('Home'), '/journal/accounts/home');
        $this->asOwner(new BeginSignInAgain($this->account->id, 'again'));
        $generation = $this->account->refresh()->sign_in_generation;

        $this->asOwner(new RemoveAccount($this->account->id));
        $this->asOwner(new RemoveAccount($this->account->id));

        $this->account->refresh();
        $this->assertSame(AccountState::Removing, $this->account->state);
        $this->assertSame($generation + 1, $this->account->sign_in_generation);
        $this->assertNull($this->account->live_writer_attempt_id);
        $this->assertSame(SignInState::Cancelled, SignInAttempt::query()->withoutGlobalScopes()->sole()->state);
        $this->assertNull(
            ActiveAccount::query()->withoutGlobalScopes()->where('program', 'codex')->value('account_id'),
        );
    }

    public function test_a_host_cleans_only_after_every_process_ended_and_only_with_both_proofs(): void
    {
        $this->startProcessOnAccount();
        $this->asOwner(new RemoveAccount($this->account->id));
        $this->reconcile();
        $this->assertNull($this->asHost(new ClaimCleanup('host')));

        DB::table('process_starts')->update(['state' => ProcessStartState::Stopped->value]);
        $this->reconcile();
        $claimed = $this->asHost(new ClaimCleanup('host'));
        $this->assertInstanceOf(ClaimedCleanup::class, $claimed);
        $this->assertSame([CleanupTarget::Account, $this->account->id], [$claimed->target, $claimed->id]);

        $this->clean($claimed->generation - 1, true, true);
        $this->clean($claimed->generation, false, true);
        $this->assertSame(AccountState::Removing, $this->account->refresh()->state);
        $this->assertNotNull($this->account->directory);

        $this->clean($claimed->generation, true, false);
        $this->assertTrue($this->account->refresh()->store_removed);
        $this->clean($claimed->generation, false, true);

        $this->account->refresh();
        $this->assertSame(AccountState::Removed, $this->account->state);
        $this->assertNull($this->account->directory);
        $this->assertSame('Test account', $this->account->label);
    }

    public function test_the_runner_signs_out_before_it_deletes_the_folder(): void
    {
        $directory = sys_get_temp_dir().'/account-cleanup-'.bin2hex(random_bytes(4));
        mkdir($directory);
        $host = new RecordingSignInHost(null);
        $protocols = new SignInProtocols($this->app);
        $protocols->register('codex', FinishingProtocol::class);
        $host->nextCleanup = new ClaimedCleanup(CleanupTarget::Account, 'account', 'codex', $directory, 1, false);
        $runner = new PrivateSignInProcesses($host, $protocols, static fn () => null);

        $this->assertTrue($runner->cleanNext());
        $host->nextCleanup = new ClaimedCleanup(CleanupTarget::Account, 'other', 'unknown', $directory.'-x', 1, false);
        mkdir($directory.'-x');
        $runner->cleanNext();

        $this->assertEquals(
            [new CleanupProgress(true, true), new CleanupProgress(false, false)],
            $host->cleanups,
        );
        $this->assertDirectoryDoesNotExist($directory);
        $this->assertDirectoryExists($directory.'-x');
        rmdir($directory.'-x');
    }

    public function test_an_account_the_host_cannot_drain_keeps_its_sign_in_and_folder(): void
    {
        $directory = sys_get_temp_dir().'/account-cleanup-'.bin2hex(random_bytes(4));
        mkdir($directory);
        $host = new RecordingSignInHost(null);
        $protocols = new SignInProtocols($this->app);
        $protocols->register('codex', FinishingProtocol::class);
        $host->nextCleanup = new ClaimedCleanup(CleanupTarget::Account, 'account', 'codex', $directory, 1, false);
        $stillRunning = new class implements AccountOwnerDrain
        {
            public function drain(string $directory): bool
            {
                return false;
            }
        };

        new PrivateSignInProcesses($host, $protocols, static fn () => null, $stillRunning)->cleanNext();

        $this->assertEquals([new CleanupProgress(false, false)], $host->cleanups);
        $this->assertDirectoryExists($directory);
        rmdir($directory);
    }

    public function test_an_unfinished_new_accounts_sign_in_is_cleaned_with_both_proofs(): void
    {
        $started = $this->asOwner(new BeginSignIn('claude-code', 'new', 'Spare'));
        $this->asOwner(new CancelSignIn($started->attemptId));

        $claimed = $this->asHost(new ClaimCleanup('host'));
        $this->assertSame([CleanupTarget::SignInAttempt, $started->attemptId], [$claimed?->target, $claimed?->id]);

        $this->asHost(new CleanSignInAttempt('host', $started->attemptId, new CleanupProgress(true, true)));

        $this->assertFalse(SignInAttempt::query()->withoutGlobalScopes()->sole()->cleanup_pending);
        $this->assertNull($this->asHost(new ClaimCleanup('host')));
    }

    public function test_a_cleanup_out_of_tries_waits_for_the_owners_retry_in_the_same_generation(): void
    {
        $this->asOwner(new RemoveAccount($this->account->id));
        $this->reconcile();
        $generation = $this->account->refresh()->sign_in_generation;

        foreach (range(1, CleanupProgress::MOST_TRIES) as $try) {
            $this->clean($generation, false, true);
        }

        $this->assertNull($this->asHost(new ClaimCleanup('host')));
        $this->assertTrue($this->account->refresh()->awaitsCleanupRetry());
        $this->assertSame(CleanupProblem::SignInNotVerified, $this->account->cleanup_problem);

        $this->asOwner(new RetryAccountCleanup($this->account->id));

        $this->assertSame($generation, $this->asHost(new ClaimCleanup('host'))?->generation);
    }

    public function test_the_owner_retries_an_unfinished_sign_ins_cleanup_by_its_attempt(): void
    {
        $started = $this->asOwner(new BeginSignIn('claude-code', 'new', 'Spare'));
        $this->asOwner(new CancelSignIn($started->attemptId));

        foreach (range(1, CleanupProgress::MOST_TRIES) as $try) {
            $this->asHost(new CleanSignInAttempt('host', $started->attemptId, new CleanupProgress(false, true)));
        }

        $this->assertNull($this->asHost(new ClaimCleanup('host')));
        $listed = $this->app->make(AccountsWindowResolver::class)->read()->pendingCleanups;
        $this->assertSame([$started->attemptId, true], [$listed[0]->attemptId, $listed[0]->awaitsRetry]);

        $this->asOwner(new RetryAttemptCleanup($started->attemptId));

        $this->assertSame($started->attemptId, $this->asHost(new ClaimCleanup('host'))?->id);
    }

    private function clean(int $generation, bool $isStoreRemoved, bool $isDirectoryRemoved): void
    {
        $progress = new CleanupProgress($isStoreRemoved, $isDirectoryRemoved);
        $this->asHost(new CleanAccount('host', $this->account->id, $generation, $progress));
    }

    private function asOwner(Command $command): mixed
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );

        return $this->app->make(CommandBus::class)->run($command);
    }

    private function asHost(Command $command): mixed
    {
        return $this->app->make(EntryDispatchers::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            $command,
        );
    }

    private function reconcile(): void
    {
        $this->app->make(EntryDispatchers::class)
            ->runAsJournal(CommandEntry::AccountMaintenance, 'account reconciliation', new ReconcileAccounts());
    }

    private function startProcessOnAccount(): void
    {
        DB::table('process_starts')->insert([
            'id' => strtolower((string) Str::ulid()),
            'agent_id' => strtolower((string) Str::ulid()),
            'session_id' => strtolower((string) Str::ulid()),
            'start_key' => (string) Str::ulid(),
            'account_type' => Account::LINK_TYPE,
            'account_id' => $this->account->id,
            'account_generation' => $this->account->sign_in_generation,
            'directory' => (string) $this->account->directory,
            'state' => ProcessStartState::Running->value,
            'role' => AccountProcessRole::Execution->value,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
