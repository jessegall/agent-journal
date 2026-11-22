<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Jobs\SignInDeadline;
use App\Models\SignInAttempt;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\Bus;
use Illuminate\Testing\TestResponse;
use Symfony\Component\HttpFoundation\Response;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every request key of a sign-in start answers its owner's receipt: a start, its replay and a second tab's key that
 * rejoins it name the same attempt, a key still names it with its actual method after it ended, and a key used for
 * another start is refused.
 */
#[TimeLimit(seconds: 5, reason: 'It starts, replays, rejoins and cancels sign-ins over the web routes.')]
final class SignInReceiptTest extends TestCase
{
    use RefreshHookDatabase;

    private const string NO_STORE_HEADER = 'no-store, private';

    private User $owner;

    private string $root;

    protected function setUp(): void
    {
        parent::setUp();

        Bus::fake([SignInDeadline::class]);
        $this->root = sys_get_temp_dir().'/sign-in-receipt-'.bin2hex(random_bytes(4));
        config(['accounts.root' => $this->root]);
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    protected function tearDown(): void
    {
        exec('rm -rf '.escapeshellarg($this->root));
        parent::tearDown();
    }

    public function test_a_start_its_replay_and_a_rejoining_tab_answer_the_same_attempt(): void
    {
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
        $this->start('tab-1', 'api_key')->assertStatus(303);
        $this->start('tab-2', 'api_key')->assertStatus(303);
        $attempt = SignInAttempt::query()->withoutGlobalScopes()->sole();

        $this->actingAs($this->owner)
            ->withHeader('Idempotency-Key', 'cancel-1')
            ->post("/accounts/sign-ins/{$attempt->id}/cancel")
            ->assertStatus(303);

        $receipt = $this->receipt('tab-2')->assertOk();
        $this->assertSame($attempt->id, $receipt->json('attemptId'));
        $this->assertSame('api_key', $receipt->json('method'));
        $this->assertSame($attempt->refresh()->state->value, $receipt->json('state'));
        $this->assertFalse($attempt->isLive());
    }

    public function test_a_key_used_for_another_start_is_refused_and_an_unknown_key_names_nothing(): void
    {
        $this->start('tab-1', 'oauth')->assertStatus(303);

        $this->start('tab-1', 'api_key')->assertStatus(303)->assertSessionHasErrors('command');
        $this->assertSame(1, SignInAttempt::query()->withoutGlobalScopes()->count());
        $this->assertSame(['status' => 'unknown'], array_filter($this->receipt('never-used')->assertOk()->json()));
    }

    public function test_another_owners_key_names_nothing(): void
    {
        $this->start('tab-1', 'oauth')->assertStatus(303);

        $stranger = User::factory()->create();
        $answer = $this->actingAs($stranger)
            ->getJson('/accounts/sign-ins/receipt?key=tab-1&driver=claude-code');

        $this->assertNotSame('started', $answer->json('status'));
    }

    /**
     * @return TestResponse<Response>
     */
    private function start(string $key, string $method): TestResponse
    {
        return $this->actingAs($this->owner)
            ->withHeader('Idempotency-Key', $key)
            ->post('/accounts/sign-ins', ['driver' => 'claude-code', 'method' => $method]);
    }

    /**
     * @return TestResponse<Response>
     */
    private function receipt(string $key): TestResponse
    {
        return $this->actingAs($this->owner)->getJson("/accounts/sign-ins/receipt?key={$key}&driver=claude-code");
    }
}
