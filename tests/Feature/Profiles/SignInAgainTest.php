<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Accounts\BeginSignInAgain\BeginSignInAgainCommand;
use App\Commands\Accounts\CancelSignIn\CancelSignInCommand;
use App\Commands\Accounts\CompleteSignIn\CompleteSignInCommand;
use App\Commands\Accounts\ReconcileAccounts\ReconcileAccountsCommand;
use App\Commands\Accounts\RemoveAccount\RemoveAccountCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Enums\Accounts\AccountProcessRole;
use App\Enums\Accounts\AccountStatus;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Accounts\SignInStatus;
use App\Enums\Agents\SessionProcessStatus;
use App\Exceptions\SignInAttemptStale;
use App\Jobs\SignInDeadline;
use App\Models\Access\User;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Accounts\SignInAttempt;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\Command;
use App\Support\JournalCommands;
use App\Values\OwnerAuthority;
use App\Values\SignInIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A sign-in proof that arrives while its account is being removed changes nothing.
 */
#[TimeLimit(seconds: 4, reason: 'It commits accounts, attempts and starts through the bus and empties seven tables.')]
final class SignInAgainTest extends TestCase
{
    use CommitsHookRows;
    use RunsKeyedCommands;
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

        User::factory()->create(['id' => TestIds::of(1)]);
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(1)));

        Bus::fake([SignInDeadline::class]);
        $this->account = $this->chooseActiveAccounts()['codex'];
        $this->account->forceFill(['subject' => 'subject-1'])->save();
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

    public function test_a_proof_arriving_during_removal_changes_nothing(): void
    {
        [$attemptId] = $this->waitingReconnect();
        $folder = $this->account->refresh()->directory;
        $generation = SignInAttempt::query()->whereKey($attemptId)->sole()->generation;

        $this->actAsOwner();
        $this->app->make(CommandBus::class)->run(new RemoveAccountCommand($this->account->id));
        $this->assertThrows(
            fn () => $this->asHost(new CompleteSignInCommand($attemptId, $generation, self::proved('subject-1'))),
            SignInAttemptStale::class,
        );

        $this->assertSame(SignInStatus::Cancelled, SignInAttempt::query()->whereKey($attemptId)->sole()->status);
        $this->account->refresh();
        $this->assertSame($folder, $this->account->directory);
        $this->assertNotSame(AccountStatus::Authenticated, $this->account->status);
        $this->assertNull($this->chosen());
    }

    private function again(string $requestKey): string
    {
        $this->actAsOwner();

        return $this->runOnBus(new BeginSignInAgainCommand($this->account->id), $requestKey)
            ->attemptId;
    }

    private function cancel(string $attemptId): void
    {
        $this->actAsOwner();
        $this->app->make(CommandBus::class)->run(new CancelSignInCommand($attemptId));
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

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }

    private function claimSignIn(string $hostId, CarbonImmutable $now): SignInAttempt|null
    {
        $attempt = SignInAttempt::findOldestWaitingAt($now);
        $attempt?->claimOn($hostId);

        return $attempt;
    }
}
