<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Enums\AccountProcessRole;
use App\Agents\Enums\ProcessStartState;
use App\Agents\Exceptions\AccountUnavailable;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Bus\Support\EntryDispatchers;
use App\Profiles\Commands\BeginSignInAgain;
use App\Profiles\Commands\CancelSignIn;
use App\Profiles\Commands\CheckAccount;
use App\Profiles\Commands\CompleteSignIn;
use App\Profiles\Commands\ReconcileAccounts;
use App\Profiles\Enums\AccountCheckResult;
use App\Profiles\Enums\AccountState;
use App\Profiles\Jobs\SignInDeadline;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\SignInAttempt;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * Signing a saved account in again: one writer however many tabs start it, no host runs it while a process still
 * runs on the account, success starts a new generation and keeps the choice, and a sign-in that ends otherwise holds
 * launches until the host's certain check says whether the account still signs in.
 */
#[TimeLimit(seconds: 4, reason: 'It commits accounts, attempts and starts through the bus and empties seven tables.')]
final class SignInAgainTest extends TestCase
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

    public function test_two_tabs_start_one_writer_and_new_launches_wait(): void
    {
        $generation = $this->account->sign_in_generation;

        $first = $this->again('tab-1');
        $second = $this->again('tab-2');

        $this->assertSame($first, $second);
        $this->account->refresh();
        $this->assertSame($first, $this->account->live_writer_attempt_id);
        $this->assertSame($generation + 1, $this->account->sign_in_generation);
        $this->expectException(AccountUnavailable::class);
        $this->account->requireAvailable();
    }

    public function test_the_host_takes_it_only_after_the_accounts_processes_ended(): void
    {
        $this->startProcessOnAccount();
        $attemptId = $this->again('tab-1');

        $this->assertNull(SignInAttempt::claimFor('host', CarbonImmutable::now()));
        $this->reconcile();
        $this->assertNull(SignInAttempt::claimFor('host', CarbonImmutable::now()));

        DB::table('process_starts')->update(['state' => ProcessStartState::Stopped->value]);
        $this->reconcile();

        $this->assertSame($attemptId, SignInAttempt::claimFor('host', CarbonImmutable::now())?->id);
    }

    public function test_success_starts_a_new_generation_and_keeps_the_choice(): void
    {
        $attemptId = $this->again('tab-1');
        $generation = $this->account->refresh()->sign_in_generation;
        SignInAttempt::query()->whereKey($attemptId)->sole()->waitForPerson();

        $this->asHost(new CompleteSignIn($attemptId, $generation, 'me@example.com'));

        $this->account->refresh();
        $this->assertSame($generation + 1, $this->account->sign_in_generation);
        $this->assertFalse($this->account->maintenance);
        $this->assertSame($this->account->id, $this->chosen());
    }

    public function test_a_cancelled_sign_in_of_a_valid_account_survives_its_certain_check(): void
    {
        $this->cancel($this->again('tab-1'));
        $generation = $this->account->refresh()->sign_in_generation;

        $this->assertTrue($this->account->isHeldForCheck());
        $this->asHost(new CheckAccount('host', $this->account->id, $generation, AccountCheckResult::Unknown));
        $this->assertTrue($this->account->refresh()->isHeldForCheck());

        $this->asHost(new CheckAccount('host', $this->account->id, $generation, AccountCheckResult::SignedIn));

        $this->account->refresh();
        $this->assertFalse($this->account->maintenance);
        $this->assertSame(AccountState::SignedIn, $this->account->state);
        $this->assertSame($this->account->id, $this->chosen());
    }

    public function test_a_cancelled_sign_in_that_left_the_account_signed_out_clears_the_choice(): void
    {
        $this->cancel($this->again('tab-1'));
        $generation = $this->account->refresh()->sign_in_generation;

        $this->asHost(new CheckAccount('host', $this->account->id, $generation, AccountCheckResult::SignedOut));

        $this->assertSame(AccountState::NeedsSignIn, $this->account->refresh()->state);
        $this->assertNull($this->chosen());
    }

    public function test_an_older_attempts_end_never_releases_a_newer_writer(): void
    {
        $old = $this->again('tab-1');
        $this->cancel($old);
        $generation = $this->account->refresh()->sign_in_generation;
        $this->asHost(new CheckAccount('host', $this->account->id, $generation, AccountCheckResult::SignedIn));
        $new = $this->again('tab-2');

        $this->account->refresh()->endSignInAgain(SignInAttempt::query()->findOrFail($old));

        $this->account->refresh();
        $this->assertSame($new, $this->account->live_writer_attempt_id);
        $this->assertTrue($this->account->maintenance);
    }

    private function again(string $requestKey): string
    {
        $this->actAsOwner();

        return $this->app->make(CommandBus::class)->run(new BeginSignInAgain($this->account->id, $requestKey))
            ->attemptId;
    }

    private function cancel(string $attemptId): void
    {
        $this->actAsOwner();
        $this->app->make(CommandBus::class)->run(new CancelSignIn($attemptId));
    }

    private function asHost(Command $command): void
    {
        $this->app->make(EntryDispatchers::class)->runAsJournal(CommandEntry::HostControl, 'test host', $command);
    }

    private function reconcile(): void
    {
        $this->app->make(EntryDispatchers::class)
            ->runAsJournal(CommandEntry::AccountMaintenance, 'account reconciliation', new ReconcileAccounts());
    }

    private function chosen(): string|null
    {
        return ActiveAccount::query()->withoutGlobalScopes()->where('program', 'codex')->value('account_id');
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

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }
}
