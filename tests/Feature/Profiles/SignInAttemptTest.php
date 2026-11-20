<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Profiles\Commands\BeginSignIn;
use App\Profiles\Commands\BeginSignInAgain;
use App\Profiles\Commands\CancelSignIn;
use App\Profiles\Commands\CompleteSignIn;
use App\Profiles\Commands\ReconcileAccounts;
use App\Profiles\Enums\AccountState;
use App\Profiles\Enums\SignInState;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Exceptions\SignInAttemptStale;
use App\Profiles\Jobs\SignInDeadline;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Values\SignInIdentity;
use App\Profiles\Values\SignInStarted;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A sign-in attempt from start to its end: a second start rejoins the one running, its deadline job holds only its
 * id, the host's verified result is saved once and only while it still speaks for the attempt, and the minute sweep
 * ends what the deadline job missed.
 */
#[TimeLimit(seconds: 3, reason: 'It commits attempts and accounts through the bus and empties five tables per test.')]
final class SignInAttemptTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = ['users', 'accounts', 'active_accounts', 'sign_in_attempts', 'command_receipts', 'links'];

    protected function setUp(): void
    {
        parent::setUp();

        User::factory()->create(['id' => TestIds::of(1)]);
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(1)));

        Bus::fake([SignInDeadline::class]);
        $this->actAsOwner();
    }

    public function test_a_second_start_and_a_repeated_request_rejoin_the_running_attempt(): void
    {
        $first = $this->begin('request-1');
        $second = $this->begin('request-2');
        $repeated = $this->begin('request-1');

        $this->assertFalse($first->didRejoin);
        $this->assertSame([$first->attemptId, $first->attemptId], [$second->attemptId, $repeated->attemptId]);
        $this->assertSame(1, SignInAttempt::query()->count());
        Bus::assertDispatched(SignInDeadline::class, fn (SignInDeadline $job) => $job->attemptId === $first->attemptId);
    }

    public function test_a_verified_sign_in_makes_the_first_account_and_chooses_it_once(): void
    {
        $started = $this->begin('request-1');
        SignInAttempt::query()->whereKey($started->attemptId)->sole()->waitForUser();

        $this->complete($started->attemptId, 0, 'work@example.test');

        $account = Account::query()->sole();
        $this->assertSame([AccountState::SignedIn, 'Work'], [$account->state, $account->label]);
        $this->assertSame($account->id, ActiveAccount::query()->sole()->account_id);
        $this->assertSame(SignInState::Complete, SignInAttempt::query()->sole()->state);
    }

    public function test_the_same_verified_report_twice_publishes_once_and_an_older_generation_is_refused(): void
    {
        $started = $this->begin('request-1');
        SignInAttempt::query()->whereKey($started->attemptId)->sole()->waitForUser();
        $this->complete($started->attemptId, 0, 'work@example.test');
        Event::fake([AccountsChanged::class]);

        $this->complete($started->attemptId, 0, 'work@example.test');

        $this->assertSame(1, Account::query()->count());
        Event::assertNotDispatched(AccountsChanged::class);
        $this->expectException(SignInAttemptStale::class);
        $this->complete($started->attemptId, 1, 'work@example.test');
    }

    public function test_a_starter_that_lost_its_grant_before_the_report_adds_no_account(): void
    {
        $started = $this->begin('request-1');
        SignInAttempt::query()->whereKey($started->attemptId)->sole()->waitForUser();
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(2)));

        $this->complete($started->attemptId, 0, 'work@example.test');

        $this->assertSame(0, Account::query()->count());
        $this->assertSame(SignInState::Failed, SignInAttempt::query()->sole()->state);
    }

    public function test_a_cancelled_attempt_ignores_a_late_result_and_owes_its_folder_cleanup(): void
    {
        $started = $this->begin('request-1');

        $this->bus()->run(new CancelSignIn($started->attemptId));

        $attempt = SignInAttempt::query()->sole();
        $this->assertSame(SignInState::Cancelled, $attempt->state);
        $this->assertTrue($attempt->cleanup_pending);
        $this->expectException(SignInAttemptStale::class);

        $this->complete($started->attemptId, 0, null);
    }

    public function test_the_sweep_ends_an_overdue_attempt_and_signing_in_again_holds_the_folder_once(): void
    {
        $account = $this->chooseActiveAccounts()['codex'];
        $this->actAsOwner();
        $again = $this->bus()->run(new BeginSignInAgain($account->id, 'request-again'));
        $rejoined = $this->bus()->run(new BeginSignInAgain($account->id, 'request-other'));

        $this->assertSame($again->attemptId, $rejoined->attemptId);
        $this->assertSame($again->attemptId, $account->refresh()->live_writer_attempt_id);
        $this->travel(16)->minutes();

        $ended = $this->app->make(EntryDispatchers::class)
            ->runAsJournal(CommandEntry::AccountMaintenance, 'test sweep', new ReconcileAccounts());

        $this->assertSame(1, $ended);
        $this->assertSame(SignInState::Expired, SignInAttempt::query()->whereKey($again->attemptId)->sole()->state);
        $this->assertNull($account->refresh()->live_writer_attempt_id);
    }

    private function begin(string $requestKey): SignInStarted
    {
        return $this->bus()->run(new BeginSignIn('claude-code', $requestKey, 'Work'));
    }

    private function complete(string $attemptId, int $generation, string|null $display): void
    {
        $this->app->make(EntryDispatchers::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new CompleteSignIn($attemptId, $generation, SignInIdentity::shown($display)),
        );
        $this->actAsOwner();
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
