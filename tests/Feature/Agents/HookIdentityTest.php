<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Domain\Agents\Http\Middleware\AuthenticateAgent;
use App\Domain\Agents\SignedCall;
use App\Domain\Hooks\HookIdentityExpired;
use App\Domain\Hooks\HookRetryWindow;
use App\Domain\Hooks\StackAccess;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Route;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

final class HookIdentityTest extends TestCase
{
    use RefreshHookDatabase;

    private const BODY = '{"hook":"stop","turn":"turn-1"}';

    protected function setUp(): void
    {
        parent::setUp();

        CarbonImmutable::setTestNow('2026-11-17 08:00:00');

        Route::post('/testing/hook-identity', function (StackAccess $access) {
            try {
                $identity = $access->hookIdentity();
            } catch (HookIdentityExpired $expired) {
                return new JsonResponse(['message' => $expired->getMessage()], 409);
            }

            return [
                'agent' => $identity->agentId,
                'session' => $identity->sessionId,
                'hook' => $identity->hookId,
                'digest' => $identity->inputDigest,
                'target' => [$access->target()->agentId, $access->target()->sessionId],
            ];
        })->middleware(AuthenticateAgent::class);
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();

        parent::tearDown();
    }

    public function test_a_signed_call_gives_the_hook_identity_of_its_own_session(): void
    {
        $launch = TestLaunch::start();

        $this->send($launch, $launch->serverHeaders(self::BODY, 'call-7', $this->now()))->assertOk()->assertExactJson([
            'agent' => $launch->agent->id,
            'session' => $launch->session->id,
            'hook' => 'call-7',
            'digest' => SignedCall::digestOf(self::BODY),
            'target' => [$launch->agent->id, $launch->session->id],
        ]);
    }

    public function test_a_retry_inside_the_window_is_the_same_call(): void
    {
        $launch = TestLaunch::start();
        $issuedAt = $this->now() - 299;

        $this->send($launch, $launch->serverHeaders(self::BODY, 'call-7', $issuedAt))->assertOk()->assertJson(['hook' => 'call-7']);
    }

    public function test_a_call_issued_before_the_window_is_refused(): void
    {
        $launch = TestLaunch::start();

        $this->send($launch, $launch->serverHeaders(self::BODY, 'call-7', $this->now() - 301))->assertStatus(409);
    }

    public function test_a_call_issued_in_the_far_future_is_refused(): void
    {
        $launch = TestLaunch::start();

        $this->send($launch, $launch->serverHeaders(self::BODY, 'call-7', $this->now() + 301))->assertStatus(409);
    }

    public function test_the_window_follows_the_configured_seconds(): void
    {
        $this->app->instance(HookRetryWindow::class, new HookRetryWindow(60));
        $launch = TestLaunch::start();

        $this->send($launch, $launch->serverHeaders(self::BODY, 'call-7', $this->now() - 61))->assertStatus(409);
    }

    public function test_a_changed_body_breaks_the_signature(): void
    {
        $launch = TestLaunch::start();
        $headers = $launch->serverHeaders(self::BODY, 'call-7', $this->now());

        $this->call('POST', '/testing/hook-identity', server: $headers, content: '{"hook":"stop","turn":"turn-2"}')->assertUnauthorized();
    }

    public function test_a_changed_call_id_or_issue_time_breaks_the_signature(): void
    {
        $launch = TestLaunch::start();
        $headers = $launch->serverHeaders(self::BODY, 'call-7', $this->now());

        $this->send($launch, [...$headers, 'HTTP_X_JOURNAL_CALL_ID' => 'call-8'])->assertUnauthorized();
        $this->send($launch, [...$headers, 'HTTP_X_JOURNAL_CALL_ISSUED_AT' => (string) ($this->now() - 1)])->assertUnauthorized();
    }

    public function test_a_call_signed_with_another_session_token_is_refused(): void
    {
        $launch = TestLaunch::start();
        $other = TestLaunch::start();

        $this->send($launch, $launch->serverHeaders(self::BODY, 'call-7', $this->now(), signingToken: $other->token))->assertUnauthorized();
    }

    public function test_a_call_without_its_identity_headers_is_refused(): void
    {
        $launch = TestLaunch::start();
        $headers = $launch->serverHeaders(self::BODY, 'call-7', $this->now());
        unset($headers['HTTP_X_JOURNAL_CALL_SIGNATURE']);

        $this->send($launch, $headers)->assertUnauthorized()->assertJson(['message' => 'The call carries no X-Journal-Call-Signature header.']);
    }

    /**
     * @param  array<string, string>  $headers
     * @return TestResponse<Response>
     */
    private function send(TestLaunch $launch, array $headers): TestResponse
    {
        return $this->call('POST', '/testing/hook-identity', server: $headers, content: self::BODY);
    }

    private function now(): int
    {
        return CarbonImmutable::now()->getTimestamp();
    }
}
