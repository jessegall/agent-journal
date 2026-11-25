<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignInAgain\BeginSignInAgainCommand;
use App\Commands\Accounts\CancelSignIn\CancelSignInCommand;
use App\Commands\Accounts\CheckAccount\CheckAccountCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Enums\Accounts\AccountCheckResult;
use App\Enums\Accounts\AccountStatus;
use App\Enums\Accounts\CommandEntry;
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
use Illuminate\Support\Facades\Bus;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The owner cancels a sign-in: no cleanup is handed out for a folder an account still uses, a reconnect's cancel cleans
 * only its staging folder, a valid account survives its certain check while a signed-out one clears the choice, a
 * failed renewal lets the account go at once, and an older attempt's end never releases a newer writer.
 */
#[TimeLimit(seconds: 4, reason: 'It commits accounts, attempts and starts through the bus and empties seven tables.')]
final class CancelSignInTest extends TestCase
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

    public function test_no_cleanup_is_handed_out_for_a_folder_an_account_still_uses(): void
    {
        [$attemptId] = $this->waitingReconnect();
        $this->cancel($attemptId);
        $attempt = SignInAttempt::query()->whereKey($attemptId)->sole();
        $this->account->forceFill(['directory' => $attempt->directory])->save();

        $this->assertNull(SignInAttempt::findNextDueForCleanup());
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

    public function test_a_reconnect_signs_in_to_its_own_staging_folder_and_a_cancel_cleans_only_that(): void
    {
        $saved = $this->account->directory;
        $attemptId = $this->again('tab-1');
        $staging = (string) SignInAttempt::query()->whereKey($attemptId)->sole()->directory;

        $this->cancel($attemptId);

        $this->assertNotSame($saved, $staging);
        $this->assertStringStartsWith(config('accounts.root').'/', $staging);
        $this->assertSame($saved, $this->account->refresh()->directory);
        $pending = array_map(fn (SignInAttempt $attempt) => $attempt->id, SignInAttempt::findPendingCleanups());
        $this->assertSame([$attemptId], $pending);
        $this->assertSame($attemptId, SignInAttempt::findNextDueForCleanup()?->id);
    }

    public function test_a_cancelled_sign_in_of_a_valid_account_survives_its_certain_check(): void
    {
        $this->cancel($this->again('tab-1'));
        $generation = $this->account->refresh()->sign_in_generation;

        $this->assertTrue($this->account->isHeldForCheck());
        $this->asHost(new CheckAccountCommand('host', $this->account->id, $generation, AccountCheckResult::Unknown));
        $this->assertTrue($this->account->refresh()->isHeldForCheck());

        $this->asHost(new CheckAccountCommand('host', $this->account->id, $generation, AccountCheckResult::SignedIn));

        $this->account->refresh();
        $this->assertFalse($this->account->maintenance);
        $this->assertSame(AccountStatus::Authenticated, $this->account->status);
        $this->assertSame($this->account->id, $this->chosen());
    }

    public function test_a_cancelled_sign_in_that_left_the_account_signed_out_clears_the_choice(): void
    {
        $this->cancel($this->again('tab-1'));
        $generation = $this->account->refresh()->sign_in_generation;

        $this->asHost(new CheckAccountCommand('host', $this->account->id, $generation, AccountCheckResult::SignedOut));

        $this->assertSame(AccountStatus::Unauthenticated, $this->account->refresh()->status);
        $this->assertNull($this->chosen());
    }

    public function test_a_failed_renewal_of_an_account_that_needed_sign_in_lets_it_go_at_once(): void
    {
        $this->account->forceFill(['status' => AccountStatus::Unauthenticated])->save();
        [$label, $folder] = [$this->account->label, $this->account->directory];

        $this->cancel($this->again('tab-1'));

        $this->account->refresh();
        $this->assertFalse($this->account->maintenance);
        $this->assertFalse($this->account->isHeldForCheck());
        $this->assertNull($this->account->live_writer_attempt_id);
        $this->assertSame([AccountStatus::Unauthenticated, $label, $folder], [
            $this->account->status,
            $this->account->label,
            $this->account->directory,
        ]);
    }

    public function test_an_older_attempts_end_never_releases_a_newer_writer(): void
    {
        $old = $this->again('tab-1');
        $this->cancel($old);
        $generation = $this->account->refresh()->sign_in_generation;
        $this->asHost(new CheckAccountCommand('host', $this->account->id, $generation, AccountCheckResult::SignedIn));
        $new = $this->again('tab-2');

        $this->account->refresh()->endSignInAgain($old);

        $this->account->refresh();
        $this->assertSame($new, $this->account->live_writer_attempt_id);
        $this->assertTrue($this->account->maintenance);
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

    private function chosen(): string|null
    {
        return ActiveAccount::query()->withoutGlobalScopes()->where('account_protocol', 'codex')->value('account_id');
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }
}
