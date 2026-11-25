<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Data\Accounts\SignInAttemptData;
use App\Enums\Accounts\SignInMethod;
use App\Exceptions\SignInMethodMissing;
use App\Jobs\SignInDeadline;
use App\Models\Access\User;
use App\Models\Accounts\SignInAttempt;
use App\Support\ActorContext;
use App\Values\OwnerAuthority;
use App\Values\SignInStarted;
use Illuminate\Support\Facades\Bus;
use Illuminate\Testing\TestResponse;
use Symfony\Component\HttpFoundation\Response;
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

    private User|null $owner = null;

    private string $root;

    private const string NO_STORE_HEADER = 'no-store, private';

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

    public function test_a_start_names_only_its_program_and_an_unknown_program_starts_nothing(): void
    {
        $this->root = sys_get_temp_dir().'/sign-in-host-'.bin2hex(random_bytes(4));
        config(['accounts.root' => $this->root]);

        $owner = $this->journal->ownerUser();
        $start = ['driver' => 'claude-code', 'method' => 'oauth'];

        $this->actingAs($owner)->withHeader('Idempotency-Key', 'request-1')->post('/accounts/sign-ins', $start)
            ->assertStatus(303);
        $this->actingAs($owner)->withHeader('Idempotency-Key', 'request-2')->post('/accounts/sign-ins', $start)
            ->assertStatus(303);
        $unknown = ['driver' => 'gemini', 'method' => 'oauth'];
        $this->actingAs($owner)->withHeader('Idempotency-Key', 'request-3')->post('/accounts/sign-ins', $unknown)
            ->assertSessionHasErrors('driver');

        $this->assertSame(1, SignInAttempt::query()->withoutGlobalScopes()->count());
    }

    public function test_a_start_carries_its_method_and_an_undeclared_method_starts_nothing(): void
    {
        $this->root = sys_get_temp_dir().'/sign-in-host-'.bin2hex(random_bytes(4));
        config(['accounts.root' => $this->root]);

        $owner = $this->journal->ownerUser();
        $start = fn (string $driver, string $method, string $key) => $this->actingAs($owner)
            ->withHeader('Idempotency-Key', $key)
            ->post('/accounts/sign-ins', ['driver' => $driver, 'method' => $method]);

        $start('claude-code', 'api_key', 'request-1')->assertStatus(303);
        $start('codex', 'provider_token', 'request-2')->assertSessionHasErrors('method');
        $start('codex', 'password', 'request-3')->assertSessionHasErrors('method');

        $this->assertSame(SignInMethod::ApiKey, SignInAttempt::query()->withoutGlobalScopes()->sole()->method);
        $owner = ActorContext::forUser($this->journal->ownerUser()->id);
        $this->app->make(CurrentActorSetter::class)->set($owner, new OwnerAuthority('test'));
        $this->assertThrows(
            fn () => $this->journal->run(new BeginSignInCommand('codex', SignInMethod::ProviderToken), 'request-4'),
            SignInMethodMissing::class,
        );
        $this->assertSame(1, SignInAttempt::query()->withoutGlobalScopes()->count());
    }

    public function test_a_start_its_replay_and_a_rejoining_tab_answer_the_same_attempt(): void
    {
        $this->root = sys_get_temp_dir().'/sign-in-receipt-'.bin2hex(random_bytes(4));
        config(['accounts.root' => $this->root]);

        $this->start('tab-1', 'oauth')->assertStatus(303);
        $this->start('tab-1', 'oauth')->assertStatus(303);
        $this->start('tab-2', 'oauth')->assertStatus(303);

        $attempt = SignInAttempt::query()->withoutGlobalScopes()->sole();
        $first = $this->receipt('tab-1')->assertOk()->assertHeader('Cache-Control', self::NO_STORE_HEADER);
        $second = $this->receipt('tab-2')->assertOk();

        $this->assertSame(
            ['status' => 'started', 'attemptId' => $attempt->id, 'type' => 'new_account', 'method' => 'oauth'],
            array_intersect_key($first->json(), array_flip(['status', 'attemptId', 'type', 'method'])),
        );
        $this->assertSame($first->json(), $second->json());
    }

    public function test_a_rejoining_key_still_names_the_ended_attempt_and_its_actual_method(): void
    {
        $this->root = sys_get_temp_dir().'/sign-in-receipt-'.bin2hex(random_bytes(4));
        config(['accounts.root' => $this->root]);

        $this->start('tab-1', 'api_key')->assertStatus(303);
        $this->start('tab-2', 'api_key')->assertStatus(303);
        $attempt = SignInAttempt::query()->withoutGlobalScopes()->sole();

        $this->actingAs($this->journal->ownerUser())
            ->withHeader('Idempotency-Key', 'cancel-1')
            ->post("/accounts/sign-ins/{$attempt->id}/cancel")
            ->assertStatus(303);

        $receipt = $this->receipt('tab-2')->assertOk();
        $this->assertSame($attempt->id, $receipt->json('attemptId'));
        $this->assertSame('api_key', $receipt->json('method'));
        $this->assertSame($attempt->refresh()->status->value, $receipt->json('state'));
        $this->assertFalse($attempt->isLive());
    }

    public function test_a_key_used_for_another_start_is_refused_and_an_unknown_key_names_nothing(): void
    {
        $this->root = sys_get_temp_dir().'/sign-in-receipt-'.bin2hex(random_bytes(4));
        config(['accounts.root' => $this->root]);

        $this->start('tab-1', 'oauth')->assertStatus(303);

        $this->start('tab-1', 'api_key')->assertStatus(303)->assertSessionHasErrors('command');
        $this->assertSame(1, SignInAttempt::query()->withoutGlobalScopes()->count());
        $this->assertSame(['status' => 'unknown'], array_filter($this->receipt('never-used')->assertOk()->json()));
    }

    public function test_another_owners_key_names_nothing(): void
    {
        $this->root = sys_get_temp_dir().'/sign-in-receipt-'.bin2hex(random_bytes(4));
        config(['accounts.root' => $this->root]);

        $this->start('tab-1', 'oauth')->assertStatus(303);

        $stranger = User::factory()->create();
        $answer = $this->actingAs($stranger)
            ->getJson('/accounts/sign-ins/receipt?key=tab-1&driver=claude-code');

        $this->assertNotSame('started', $answer->json('status'));
    }

    private function begin(string $requestKey): SignInStarted
    {
        return $this->journal->run(new BeginSignInCommand('claude-code', SignInMethod::OAuth), $requestKey);
    }

    /**
     * @return TestResponse<Response>
     */
    private function receipt(string $key): TestResponse
    {
        return $this->actingAs($this->journal->ownerUser())->getJson(
            "/accounts/sign-ins/receipt?key={$key}&driver=claude-code",
        );
    }

    /**
     * @return TestResponse<Response>
     */
    private function start(string $key, string $method): TestResponse
    {
        return $this->actingAs($this->journal->ownerUser())
            ->withHeader('Idempotency-Key', $key)
            ->post('/accounts/sign-ins', ['driver' => 'claude-code', 'method' => $method]);
    }
}
