<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Data\Accounts\SignInAttemptData;
use App\Enums\Accounts\SignInMethod;
use App\Jobs\SignInDeadline;
use App\Models\Access\User;
use App\Models\Accounts\SignInAttempt;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Values\OwnerAuthority;
use App\Values\SignInStarted;
use Illuminate\Support\Facades\Bus;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The owner begins a sign-in: a second start and a repeated request rejoin the running attempt, and an attempt no
 * sign-in service took up says so after a while.
 */
#[TimeLimit(seconds: 3, reason: 'It commits attempts and accounts through the bus and empties five tables per test.')]
final class BeginSignInTest extends TestCase
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
    ];

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

        $this->assertFalse($first->hasRejoined);
        $this->assertSame([$first->attemptId, $first->attemptId], [$second->attemptId, $repeated->attemptId]);
        $this->assertSame(1, SignInAttempt::query()->count());
        Bus::assertDispatched(SignInDeadline::class, fn (SignInDeadline $job) => $job->attemptId === $first->attemptId);
    }

    public function test_an_attempt_no_sign_in_service_took_up_says_so_after_a_while(): void
    {
        $started = $this->begin('request-1');
        $read = fn () => SignInAttemptData::fromAttempt(SignInAttempt::query()->whereKey($started->attemptId)->with('resultAccount')->sole());

        $this->assertFalse($read()->isUnclaimed);

        $this->travel(SignInAttempt::UNCLAIMED_SECONDS)->seconds();

        $this->assertTrue($read()->isUnclaimed);
    }

    private function begin(string $requestKey): SignInStarted
    {
        return $this->runOnBus(new BeginSignInCommand('claude-code', SignInMethod::OAuth), $requestKey);
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }
}
