<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\SignInStatus;
use App\Jobs\SignInDeadline;
use App\Models\Access\User;
use App\Models\Accounts\SignInAttempt;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\EnrolledHost;
use App\Support\SignInChallenges;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A host takes the code the owner typed: a code with a control character and a cancelled sign-in give it nothing, an
 * answer whose acceptance never committed is never handed over, a delivery that breaks ends the attempt interrupted
 * with the answer erased, and a failed answer flashes no code into the session.
 */
#[TimeLimit(seconds: 5, reason: 'It enrolls hosts, sends signed calls and runs a short host process.')]
final class TakeSignInCodeTest extends TestCase
{
    use CommitsHookRows;
    use RunsKeyedCommands;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const array TABLES = [
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'command_receipts',
        'hosts',
        'users',
    ];

    private User|null $owner = null;

    private string $root;

    protected function setUp(): void
    {
        parent::setUp();

        Bus::fake([SignInDeadline::class]);
        $this->root = sys_get_temp_dir().'/sign-in-host-'.bin2hex(random_bytes(4));
        config(['accounts.root' => $this->root]);
    }

    public function test_a_code_with_a_control_character_and_a_cancelled_sign_in_give_the_host_nothing(): void
    {
        $owner = $this->owner();
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->signed($host, '/host/sign-ins/claim');

        $this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/code", ['code' => "12\u{0007}34"]);
        $this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/cancel")->assertStatus(303);
        $this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/code", ['code' => '1234']);

        $this->signed($host, "/host/sign-ins/{$attemptId}/code", ['generation' => 0])
            ->assertExactJson(['live' => false, 'code' => null]);
        $this->assertSame(SignInStatus::Cancelled, $this->signInAttempt($attemptId)->status);
        $read = $this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/challenge");
        $this->assertNull($read->json('address'));
    }

    public function test_an_answer_whose_acceptance_never_committed_is_never_handed_to_the_host(): void
    {
        $owner = $this->owner();
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->signed($host, '/host/sign-ins/claim');
        $this->notify($host, $attemptId, 'waiting')->assertNoContent();

        $this->app->make(SignInChallenges::class)
            ->typeCode($attemptId, 'answer-rolled-back', '1234', CarbonImmutable::now()->addMinutes(5));

        $this->signed($host, "/host/sign-ins/{$attemptId}/code", ['generation' => 0])
            ->assertExactJson(['live' => true, 'code' => null]);
        $this->actingAs($owner)->withHeader('Idempotency-Key', 'answer-1')
            ->post("/accounts/sign-ins/{$attemptId}/code", ['code' => '5678'])->assertStatus(303);
        $this->signed($host, "/host/sign-ins/{$attemptId}/code", ['generation' => 0])
            ->assertExactJson(['live' => true, 'code' => '5678']);
    }

    public function test_a_delivery_that_breaks_ends_the_attempt_interrupted_with_the_answer_erased(): void
    {
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->signed($host, '/host/sign-ins/claim');
        $this->notify($host, $attemptId, 'waiting')->assertNoContent();
        $this->actingAs($this->owner())->withHeader('Idempotency-Key', 'answer-1')
            ->post("/accounts/sign-ins/{$attemptId}/code", ['code' => '1234'])->assertStatus(303);

        $this->notify($host, $attemptId, 'interrupted')->assertNoContent();

        $attempt = $this->signInAttempt($attemptId);
        $this->assertSame(SignInStatus::Interrupted, $attempt->status);
        $this->assertNull($attempt->refusal);
        $this->assertNull($this->app->make(SignInChallenges::class)->takeCode($attempt));
    }

    public function test_a_failed_answer_flashes_no_code_into_the_session(): void
    {
        $owner = $this->owner();
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->signed($host, '/host/sign-ins/claim');
        $this->notify($host, $attemptId, 'waiting')->assertNoContent();

        $this->actingAs($owner)->withHeader('Idempotency-Key', 'answer-1')
            ->from('/accounts')
            ->post("/accounts/sign-ins/{$attemptId}/code", ['code' => 'secret code with spaces'])
            ->assertStatus(303)
            ->assertSessionMissing('_old_input.code');
    }

    /**
     * The journal's owner, made once per test, as the web sign-in admits them.
     */
    private function owner(): User
    {
        $this->owner ??= User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));

        return $this->owner;
    }

    private function begin(): string
    {
        $owner = ActorContext::forUser($this->owner()->id);
        $this->app->make(CurrentActorSetter::class)->set($owner, new OwnerAuthority('test'));

        $begin = new BeginSignInCommand('claude-code', SignInMethod::OAuth);
        $started = $this->runOnBus($begin, (string) Str::ulid());

        return $started->attemptId;
    }

    private function signInAttempt(string $attemptId): SignInAttempt
    {
        return SignInAttempt::query()->withoutGlobalScopes()->findOrFail($attemptId);
    }

    /**
     * @param  array<string, string>  $identity
     */
    private function notify(
        EnrolledHost $host,
        string $attemptId,
        string $outcome,
        array $identity = [],
    ): TestResponse {
        $body = ['outcome' => $outcome, 'generation' => 0, ...$identity];

        return $this->signed($host, "/host/sign-ins/{$attemptId}/report", $body);
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function signed(EnrolledHost $host, string $target, array $body = []): TestResponse
    {
        return $this->signedHostCall($host, 'POST', $target, $body === [] ? '' : (string) json_encode($body));
    }

    private function enrollHost(): EnrolledHost
    {
        return $this->asSystem(new EnrollHostCommand('test host '.Str::random(6), ['/work']));
    }
}
