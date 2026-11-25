<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignInAgain\BeginSignInAgainCommand;
use App\Commands\Accounts\CompleteSignIn\CompleteSignInCommand;
use App\Commands\Accounts\ReconcileAccounts\ReconcileAccountsCommand;
use App\Enums\Accounts\AccountProcessRole;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\SignInStatus;
use App\Enums\Agents\SessionProcessStatus;
use App\Exceptions\AccountUnavailable;
use App\Jobs\SignInDeadline;
use App\Models\Access\User;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Accounts\SignInAttempt;
use App\Support\Command;
use App\Support\DefaultDrivers;
use App\Support\JournalCommands;
use App\Values\AccountLabel;
use App\Values\SignInIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The owner signs an account in again: two tabs start one writer and new starts wait, success starts a new generation
 * and keeps the choice, the same principal moves the account to its staging folder, another principal ends as a
 * different account, a key account swaps to its new key, and a key another account holds ends already added.
 */
#[TimeLimit(seconds: 4, reason: 'It commits accounts, attempts and starts through the bus and empties seven tables.')]
final class BeginSignInAgainTest extends TestCase
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

    public function test_two_tabs_start_one_writer_and_new_starts_wait(): void
    {
        $generation = $this->account->sign_in_generation;

        $first = $this->again('tab-1');
        $second = $this->again('tab-2');

        $this->assertSame($first, $second);
        $this->account->refresh();
        $this->assertSame($first, $this->account->live_writer_attempt_id);
        $this->assertSame($generation + 1, $this->account->sign_in_generation);
        $this->expectException(AccountUnavailable::class);
        $this->account->assertAvailable();
    }

    public function test_success_starts_a_new_generation_and_keeps_the_choice(): void
    {
        $attemptId = $this->again('tab-1');
        $generation = $this->account->refresh()->sign_in_generation;
        SignInAttempt::query()->whereKey($attemptId)->sole()->waitForUser();

        $this->asHost(new CompleteSignInCommand($attemptId, $generation, self::proved('subject-1')));

        $this->account->refresh();
        $this->assertSame($generation + 1, $this->account->sign_in_generation);
        $this->assertFalse($this->account->maintenance);
        $this->assertSame($this->account->id, $this->chosen());
    }

    public function test_the_same_principal_moves_the_account_to_its_staging_folder_and_owes_the_old_one(): void
    {
        $saved = (string) $this->account->directory;
        [$attemptId, $staging] = $this->waitingReconnect();

        $generation = SignInAttempt::query()->whereKey($attemptId)->sole()->generation;
        $this->asHost(new CompleteSignInCommand($attemptId, $generation, self::proved('subject-1')));

        $this->assertSame($staging, $this->account->refresh()->directory);
        $attempt = SignInAttempt::query()->whereKey($attemptId)->sole();
        $this->assertSame(SignInStatus::Complete, $attempt->status);
        $this->assertSame($saved, $attempt->directory);
        $this->assertTrue($attempt->cleanup_pending);
        $this->assertSame($attemptId, SignInAttempt::findNextDueForCleanup()?->id);
    }

    public function test_another_principal_ends_as_a_different_account_and_none_cannot_verify_and_both_replace_nothing(): void
    {
        $saved = (string) $this->account->directory;

        $outcomes = [
            [self::proved('subject-2'), SignInStatus::DifferentAccount],
            [SignInIdentity::shown('me@example.com'), SignInStatus::Unverified],
        ];

        foreach ($outcomes as [$identity, $expected]) {
            [$attemptId] = $this->waitingReconnect();
            $generation = SignInAttempt::query()->whereKey($attemptId)->sole()->generation;

            $this->asHost(new CompleteSignInCommand($attemptId, $generation, $identity));

            $state = SignInAttempt::query()->whereKey($attemptId)->sole()->status;
            $this->assertSame($expected, $state);
            $this->assertSame($saved, $this->account->refresh()->directory);
            $this->assertNull($this->account->live_writer_attempt_id);
            $this->account->forceFill(['maintenance' => false, 'check_requested_generation' => null])->save();
        }
    }

    public function test_replace_key_swaps_a_key_account_to_its_new_key_without_a_subject(): void
    {
        $keyAccount = ['method' => SignInMethod::ApiKey, 'fingerprint' => 'old', 'subject' => null];
        $this->account->forceFill($keyAccount)->save();
        [$attemptId, $staging] = $this->waitingReconnect();
        $attempt = SignInAttempt::query()->whereKey($attemptId)->sole();
        $attempt->keepFingerprint('new');

        $this->asHost(new CompleteSignInCommand($attemptId, $attempt->generation, SignInIdentity::unproved()));

        $this->account->refresh();
        $this->assertSame(SignInMethod::ApiKey, $attempt->method);
        $this->assertSame([$staging, 'new'], [$this->account->directory, $this->account->fingerprint]);
        $this->assertSame($this->account->id, $this->chosen());
    }

    public function test_a_key_another_account_already_holds_ends_already_added(): void
    {
        $this->account->forceFill(['method' => SignInMethod::ApiKey, 'fingerprint' => 'old'])->save();
        $other = Account::create(DefaultDrivers::CODEX, AccountLabel::from('Other'), '/journal/accounts/other');
        $other->forceFill(['fingerprint' => 'shared'])->save();
        $saved = $this->account->directory;
        [$attemptId] = $this->waitingReconnect();
        $attempt = SignInAttempt::query()->whereKey($attemptId)->sole();
        $attempt->keepFingerprint('shared');

        $this->asHost(new CompleteSignInCommand($attemptId, $attempt->generation, SignInIdentity::unproved()));

        $this->assertSame(SignInStatus::AlreadyAdded, $attempt->refresh()->status);
        $this->assertSame($saved, $this->account->refresh()->directory);
    }

    /**
     * A reconnect of the account, waiting for the user, and its staging folder.
     *
     * @return array{string, string}
     */
    private function waitingReconnect(): array
    {
        $attemptId = $this->again('tab-'.bin2hex(random_bytes(3)));
        $attempt = SignInAttempt::query()->whereKey($attemptId)->sole();
        $attempt->waitForUser();

        return [$attemptId, (string) $attempt->directory];
    }

    private static function proved(string $subject): SignInIdentity
    {
        return new SignInIdentity('me@example.com', $subject, null);
    }

    private function again(string $requestKey): string
    {
        $this->journal->actAs('Owner');

        return $this->journal->run(new BeginSignInAgainCommand($this->account->id), $requestKey)
            ->attemptId;
    }

    private function asHost(Command $command): void
    {
        $this->app->make(JournalCommands::class)->runAsJournal(CommandEntry::HostControl, 'test host', $command);
    }

    private function reconcile(): void
    {
        $this->app->make(JournalCommands::class)
            ->runAsJournal(CommandEntry::AccountMaintenance, 'account reconciliation', new ReconcileAccountsCommand());
    }

    private function chosen(): string|null
    {
        return ActiveAccount::query()->withoutGlobalScopes()->where('account_protocol', 'codex')->value('account_id');
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
}
