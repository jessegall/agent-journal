<?php

declare(strict_types=1);

namespace Tests\Fixtures\Agents;

use App\Agents\Enums\AgentRole;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Actions\AgentRuntimes;
use App\Agents\Actions\AgentSessions;
use App\Agents\Actions\LaunchCredentials;
use App\Agents\Enums\DriverType;
use App\Agents\Lifecycle\AgentLifecycle;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\AgentContext;
use App\Agents\Support\RuntimeIntent;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Application;

/**
 * One launched test agent with its session and token, and the server headers of a call it signs.
 */
final readonly class TestLaunch
{
    private function __construct(
        public Agent $agent,
        public AgentSession $session,
        public string $token,
    ) {}

    public static function start(string $role = 'hooks.main_ready'): self
    {
        $agent = Agent::named('Test agent', AgentRole::from($role));
        $session = new AgentSessions(new AgentLifecycle())->start($agent, TestSelections::of(), TestSelections::requestId());

        return new self($agent, $session, new LaunchCredentials()->issue($session));
    }

    /**
     * Starts a fresh request as this agent and session, binding what the agent middleware binds for its call.
     */
    public function startRequest(Application $app): void
    {
        $call = new SignedCall('call-1', CarbonImmutable::now(), str_repeat('a', 64));
        $context = new AgentContext($this->agent->id, $this->session->id, $this->agent->role, $call, null);
        $app->forgetScopedInstances();
        $app->instance(AgentContext::class, $context);
        $app->make(CurrentActorSetter::class)->set(ActorContext::forAgent($this->agent->id));
    }

    /**
     * Opens the session's runtime in the project folder, so a line Core admits has a runner to run in.
     */
    public function openRuntime(Application $app): void
    {
        $intent = new RuntimeIntent(
            'host-1',
            base_path(),
            'claude',
            '1.0.0',
            'default',
            DriverType::Process,
            null,
            null,
            null,
        );
        $app->make(AgentRuntimes::class)->open($this->session, $intent, 'launch-token');
    }

    /**
     * @return array<string, string>
     */
    public function serverHeaders(string $body, string $callId = 'call-1', int|null $issuedAt = null, string|null $signingToken = null, string $method = 'POST', string $target = '/'): array
    {
        $issuedAt ??= time();
        $signature = SignedCall::signatureFor($signingToken ?? $this->token, $method, $target, $callId, $issuedAt, $body);

        return [
            'HTTP_AUTHORIZATION' => "Bearer {$this->token}",
            'HTTP_X_JOURNAL_CALL_ID' => $callId,
            'HTTP_X_JOURNAL_CALL_ISSUED_AT' => (string) $issuedAt,
            'HTTP_X_JOURNAL_CALL_SIGNATURE' => $signature,
            'HTTP_X_JOURNAL_PROTOCOL' => SignedCall::PROTOCOL,
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
        ];
    }
}
