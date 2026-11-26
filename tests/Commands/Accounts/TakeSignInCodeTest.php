<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Commands\Accounts\ClaimSignIn\ClaimSignInCommand;
use App\Commands\Accounts\NotifySignIn\NotifySignInCommand;
use App\Commands\Accounts\PublishSignInChallenge\PublishSignInChallengeCommand;
use App\Commands\Accounts\TakeSignInCode\TakeSignInCodeCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\SignInOutcome;
use App\Enums\Accounts\SignInStatus;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\SignInAttempt;
use App\Support\EnrolledHost;
use App\Support\SignInChallenges;
use App\Values\ClaimedSignIn;
use App\Values\SignInIdentity;
use App\Values\SignInPoll;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A host takes the code the owner typed: a code with a control character and a cancelled sign-in give it nothing, an
 * answer whose acceptance never committed is never handed over, a delivery that breaks ends the attempt interrupted
 * with the answer erased, and a failed answer flashes no code into the session.
 */
#[TimeLimit(seconds: 5, reason: 'It enrolls hosts, sends signed calls and runs a short host process.')]
#[TestsCommand(TakeSignInCodeCommand::class)]
final class TakeSignInCodeTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'command_receipts',
        'hosts',
        'users',
    ];

    private string $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        Bus::fake([SignInDeadline::class]);
        $this->root = sys_get_temp_dir().'/sign-in-host-'.bin2hex(random_bytes(4));
        config(['accounts.root' => $this->root]);
    }

    public function test_a_code_with_a_control_character_and_a_cancelled_sign_in_give_the_host_nothing(): void
    {
        $owner = $this->journal->ownerUser();
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->claim($host);

        $this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/code", ['code' => "12\u{0007}34"]);
        $this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/cancel")->assertStatus(303);
        $this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/code", ['code' => '1234']);

        $this->assertEquals(new SignInPoll(false, null), $this->takeCode($host, $attemptId, 0));
        $this->assertSame(SignInStatus::Cancelled, $this->signInAttempt($attemptId)->status);
        $read = $this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/challenge");
        $this->assertNull($read->json('address'));
    }

    public function test_an_answer_whose_acceptance_never_committed_is_never_handed_to_the_host(): void
    {
        $owner = $this->journal->ownerUser();
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->claim($host);
        $this->notify($host, $attemptId, SignInOutcome::Waiting);

        $this->app->make(SignInChallenges::class)
            ->typeCode($attemptId, 'answer-rolled-back', '1234', CarbonImmutable::now()->addMinutes(5));

        $this->assertEquals(new SignInPoll(true, null), $this->takeCode($host, $attemptId, 0));
        $this->actingAs($owner)->withHeader('Idempotency-Key', 'answer-1')
            ->post("/accounts/sign-ins/{$attemptId}/code", ['code' => '5678'])->assertStatus(303);
        $this->assertEquals(new SignInPoll(true, '5678'), $this->takeCode($host, $attemptId, 0));
    }

    public function test_a_delivery_that_breaks_ends_the_attempt_interrupted_with_the_answer_erased(): void
    {
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->claim($host);
        $this->notify($host, $attemptId, SignInOutcome::Waiting);
        $this->actingAs($this->journal->ownerUser())->withHeader('Idempotency-Key', 'answer-1')
            ->post("/accounts/sign-ins/{$attemptId}/code", ['code' => '1234'])->assertStatus(303);

        $this->notify($host, $attemptId, SignInOutcome::Interrupted);

        $attempt = $this->signInAttempt($attemptId);
        $this->assertSame(SignInStatus::Interrupted, $attempt->status);
        $this->assertNull($attempt->refusal);
        $this->assertNull($this->app->make(SignInChallenges::class)->takeCode($attempt));
    }

    public function test_a_failed_answer_flashes_no_code_into_the_session(): void
    {
        $owner = $this->journal->ownerUser();
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->claim($host);
        $this->notify($host, $attemptId, SignInOutcome::Waiting);

        $this->actingAs($owner)->withHeader('Idempotency-Key', 'answer-1')
            ->from('/accounts')
            ->post("/accounts/sign-ins/{$attemptId}/code", ['code' => 'secret code with spaces'])
            ->assertStatus(303)
            ->assertSessionMissing('_old_input.code');
    }

    private function begin(): string
    {
        $this->journal->actAs('Owner');

        $begin = new BeginSignInCommand('claude-code', SignInMethod::OAuth);
        $started = $this->journal->run($begin, (string) Str::ulid());

        return $started->attemptId;
    }

    private function signInAttempt(string $attemptId): SignInAttempt
    {
        return SignInAttempt::query()->withoutGlobalScopes()->findOrFail($attemptId);
    }

    private function claim(EnrolledHost $host): ClaimedSignIn|null
    {
        return $this->journal->asSystem(new ClaimSignInCommand($host->hostId));
    }

    /**
     * @param  array{address: string, code: string|null}  $challenge
     */
    private function publishChallenge(EnrolledHost $host, string $attemptId, array $challenge): void
    {
        $this->journal->asSystem(
            new PublishSignInChallengeCommand($host->hostId, $attemptId, $challenge['address'], $challenge['code']),
        );
    }

    private function takeCode(EnrolledHost $host, string $attemptId, int $generation): SignInPoll
    {
        return $this->journal->asSystem(new TakeSignInCodeCommand($host->hostId, $attemptId, $generation));
    }

    private function notify(
        EnrolledHost $host,
        string $attemptId,
        SignInOutcome $outcome,
        SignInIdentity $identity = new SignInIdentity(null, null, null),
        string|null $refusal = null,
    ): void {
        $this->journal->asSystem(new NotifySignInCommand($host->hostId, $attemptId, 0, $outcome, $identity, $refusal));
    }

    private function enrollHost(): EnrolledHost
    {
        return $this->journal->asSystem(new EnrollHostCommand('test host '.Str::random(6), ['/work']));
    }
}
