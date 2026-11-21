<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Bus\Support\RequiredListenerRegistry;
use App\Profiles\Commands\BeginSignIn;
use App\Profiles\Commands\BeginSignInAgain;
use App\Profiles\Commands\CancelSignIn;
use App\Profiles\Commands\ExpireSignInAttempt;
use App\Profiles\Enums\AccountState;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Enums\SignInState;
use App\Profiles\Events\SignInAttemptFinished;
use App\Profiles\Jobs\SignInDeadline;
use App\Profiles\Listeners\ReleaseSignInWriter;
use App\Profiles\Models\Account;
use App\Profiles\Models\SignInAttempt;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Bus;
use RuntimeException;
use Tests\Fixtures\Profiles\FailsAfterRelease;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A sign-in attempt that ends without completing raises SignInAttemptFinished on itself, and the required listener
 * releases the account it wrote in the same transaction: a signed-in account is held for a generation check, one
 * needing a sign-in is let go, an attempt with no account looks no account up, and a failure after the release rolls
 * both rows back.
 */
final class ReleaseSignInWriterTest extends TestCase
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
        'process_starts',
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
    }

    public function test_cancelling_a_reconnect_ends_it_with_cleanup_and_holds_a_signed_in_account_for_a_check(): void
    {
        $attemptId = $this->again('tab-1');

        $this->asOwner(new CancelSignIn($attemptId));

        $attempt = SignInAttempt::query()->withoutGlobalScopes()->findOrFail($attemptId);
        $this->account->refresh();
        $this->assertSame(SignInState::Cancelled, $attempt->state);
        $this->assertTrue($attempt->cleanup_pending);
        $this->assertNull($this->account->live_writer_attempt_id);
        $this->assertSame($this->account->sign_in_generation, $this->account->check_requested_generation);
    }

    public function test_an_account_needing_a_sign_in_is_let_go_out_of_maintenance(): void
    {
        $this->account->forceFill(['state' => AccountState::NeedsSignIn])->save();
        $attemptId = $this->again('tab-1');

        $this->asOwner(new CancelSignIn($attemptId));

        $this->assertFalse($this->account->refresh()->maintenance);
        $this->assertNull($this->account->live_writer_attempt_id);
    }

    public function test_an_attempt_with_no_account_looks_no_account_up_when_it_expires(): void
    {
        $this->actAsOwner();
        $begin = new BeginSignIn('codex', SignInMethod::OAuth, 'new');
        $attemptId = $this->app->make(CommandBus::class)->run($begin)->attemptId;
        $attempts = SignInAttempt::query()->withoutGlobalScopes();
        $attempts->whereKey($attemptId)->update(['expires_at' => now()->subMinute()]);
        $accountReads = [];
        $recordAccountReads = function (QueryExecuted $query) use (&$accountReads): void {
            if (str_contains($query->sql, '"accounts"')) {
                $accountReads[] = $query->sql;
            }
        };
        $this->app->make(Dispatcher::class)->listen(QueryExecuted::class, $recordAccountReads);

        $this->asJournal(new ExpireSignInAttempt($attemptId));

        $expired = SignInAttempt::query()->withoutGlobalScopes()->findOrFail($attemptId);

        $this->assertSame(SignInState::Expired, $expired->state);
        $this->assertSame([], $accountReads);
    }

    public function test_a_failure_after_the_release_rolls_back_the_attempt_and_the_account(): void
    {
        $attemptId = $this->again('tab-1');
        $this->app->instance(RequiredListenerRegistry::class, new RequiredListenerRegistry([
            SignInAttemptFinished::class => [ReleaseSignInWriter::class.'@handle', FailsAfterRelease::class.'@handle'],
        ]));

        $this->assertThrows(fn () => $this->asOwner(new CancelSignIn($attemptId)), RuntimeException::class);

        $attempt = SignInAttempt::query()->withoutGlobalScopes()->findOrFail($attemptId);
        $this->assertNotSame(SignInState::Cancelled, $attempt->state);
        $this->assertSame($attemptId, $this->account->refresh()->live_writer_attempt_id);
    }

    private function again(string $requestKey): string
    {
        $this->actAsOwner();

        return $this->app->make(CommandBus::class)->run(new BeginSignInAgain($this->account->id, $requestKey))
            ->attemptId;
    }

    private function asOwner(object $command): void
    {
        $this->actAsOwner();
        $this->app->make(CommandBus::class)->run($command);
    }

    private function asJournal(object $command): void
    {
        $this->app->make(EntryDispatchers::class)->runAsJournal(CommandEntry::AccountMaintenance, 'test', $command);
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }
}
