<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Actions\AgentSessions;
use App\Agents\Actions\LaunchCredentials;
use App\Agents\Exceptions\AgentContextMissing;
use App\Agents\Support\AgentContext;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * Every refused agent call gets one structured unauthenticated answer, and no agent context outlives its request.
 */
final class AuthenticateAgentTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedCalls;

    private const array TABLES = ['agents', 'agent_sessions', 'launch_credentials'];

    private const array UNAUTHENTICATED = [
        'code' => 'unauthenticated',
        'message' => 'The call could not be authenticated with this launch credential.',
    ];

    public function test_an_unknown_credential_gets_the_unauthenticated_body(): void
    {
        $launch = TestLaunch::start();
        $content = '{}';
        $headers = $launch->serverHeaders($content, signingToken: 'not-the-token', target: '/agent/heartbeat');
        $headers['HTTP_AUTHORIZATION'] = 'Bearer not-a-launch-token';

        $this->call(
            'POST',
            '/agent/heartbeat',
            server: $headers,
            content: $content,
        )->assertUnauthorized()->assertExactJson(self::UNAUTHENTICATED);
    }

    public function test_a_revoked_credential_gets_the_unauthenticated_body(): void
    {
        $launch = TestLaunch::start();
        new LaunchCredentials()->revoke($launch->session);

        $this->signed(
            $launch,
            '/agent/heartbeat',
            ['request_key' => bin2hex(random_bytes(8))],
        )->assertUnauthorized()->assertExactJson(self::UNAUTHENTICATED);
    }

    public function test_an_ended_session_gets_the_unauthenticated_body(): void
    {
        $launch = TestLaunch::start();
        $this->app->make(AgentSessions::class)->end($launch->session);

        $this->signed(
            $launch,
            '/agent/heartbeat',
            ['request_key' => bin2hex(random_bytes(8))],
        )->assertUnauthorized()->assertExactJson(self::UNAUTHENTICATED);
    }

    public function test_a_retired_agent_gets_the_unauthenticated_body(): void
    {
        $launch = TestLaunch::start();
        $launch->agent->retireAt(CarbonImmutable::now());

        $this->signed(
            $launch,
            '/agent/heartbeat',
            ['request_key' => bin2hex(random_bytes(8))],
        )->assertUnauthorized()->assertExactJson(self::UNAUTHENTICATED)->assertDontSee($launch->token);
    }

    public function test_after_a_request_the_container_no_longer_resolves_its_agent_context(): void
    {
        $launch = TestLaunch::start();

        $this->signed($launch, '/agent/heartbeat', ['request_key' => bin2hex(random_bytes(8))])->assertSuccessful();

        $this->assertThrows(fn () => $this->app->make(AgentContext::class), AgentContextMissing::class);
    }
}
