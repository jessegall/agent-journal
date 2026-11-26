<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Data\Accounts\SignInAttemptData;
use App\Enums\Accounts\SignInMethod;
use App\Exceptions\RequestKeyConflict;
use App\Exceptions\SignInMethodMissing;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\SignInAttempt;
use App\Values\SignInStarted;
use Illuminate\Support\Facades\Bus;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The owner begins a sign-in: a second start and a repeated request rejoin the running attempt, and an attempt no
 * sign-in service took up says so after a while.
 */
#[TimeLimit(seconds: 3, reason: 'It commits attempts and accounts through the bus and empties five tables per test.')]
#[TestsCommand(BeginSignInCommand::class)]
final class BeginSignInTest extends TestCase
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
        'hosts',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        Bus::fake([SignInDeadline::class]);
        $this->journal->actAs('Owner');
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
        $read = fn () => SignInAttemptData::fromAttempt(
            SignInAttempt::query()->whereKey($started->attemptId)->with('resultAccount')->sole(),
        );

        $this->assertFalse($read()->isUnclaimed);

        $this->travel(SignInAttempt::UNCLAIMED_SECONDS)->seconds();

        $this->assertTrue($read()->isUnclaimed);
    }

    public function test_a_start_carries_its_method_and_an_undeclared_method_starts_nothing(): void
    {
        config(['accounts.root' => sys_get_temp_dir().'/sign-in-host-'.bin2hex(random_bytes(4))]);

        $this->journal->run(new BeginSignInCommand('claude-code', SignInMethod::ApiKey), 'request-1');

        $this->assertSame(SignInMethod::ApiKey, SignInAttempt::query()->withoutGlobalScopes()->sole()->method);
        $this->journal->assertRefused(
            SignInMethodMissing::class,
            fn () => $this->journal->run(new BeginSignInCommand('codex', SignInMethod::ProviderToken), 'request-2'),
        );
        $this->assertSame(1, SignInAttempt::query()->withoutGlobalScopes()->count());
    }

    public function test_a_key_used_for_another_start_is_refused(): void
    {
        config(['accounts.root' => sys_get_temp_dir().'/sign-in-receipt-'.bin2hex(random_bytes(4))]);
        $this->journal->run(new BeginSignInCommand('claude-code', SignInMethod::OAuth), 'tab-1');

        $this->journal->assertRefused(
            RequestKeyConflict::class,
            fn () => $this->journal->run(new BeginSignInCommand('claude-code', SignInMethod::ApiKey), 'tab-1'),
        );
        $this->assertSame(1, SignInAttempt::query()->withoutGlobalScopes()->count());
    }

    private function begin(string $requestKey): SignInStarted
    {
        return $this->journal->run(new BeginSignInCommand('claude-code', SignInMethod::OAuth), $requestKey);
    }
}
