<?php

declare(strict_types=1);

namespace Tests\Fixtures\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Values\RuntimeIntent;
use App\Api\SignedCall;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Profiles\StartProfilePin;
use App\Sessions\AgentRuntimes;
use App\Sessions\AgentSessions;
use App\Sessions\Contracts\StartTransaction;
use App\Sessions\SessionTokens;
use App\Sessions\States\SessionStateLifecycle;
use App\Support\ActorReference;
use App\Support\AgentContext;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Illuminate\Container\Container;
use Illuminate\Foundation\Application;
use Tests\Support\TestProjects;
use Tests\Support\TestStartAuthority;

/**
 * One started test agent with its session and token, and the server headers of a call it signs.
 */
final readonly class TestStart
{
    private function __construct(
        public Agent $agent,
        public AgentSession $session,
        public string $token,
    ) {}

    /**
     * A start the test made another way, signing with the token that start was issued.
     */
    public static function of(Agent $agent, AgentSession $session, string $token): self
    {
        return new self($agent, $session, $token);
    }

    public static function start(string $profileKey = 'main-agent'): self
    {
        $project = TestProjects::local();
        $agent = Agent::create('Test agent', $profileKey, $project);
        $sessions = Container::getInstance()->make(AgentSessions::class);
        $session = $sessions->start($agent, TestSelections::of(), TestSelections::requestId());

        return new self($agent, $session, new SessionTokens()->issue($session));
    }

    /**
     * Starts a fresh request as this agent and session, binding what the agent middleware binds for its call.
     */
    public function startRequest(Application $app): void
    {
        $call = new SignedCall('call-1', CarbonImmutable::now(), str_repeat('a', 64));
        $context = new AgentContext($this->agent->id, $this->session->id, $call, null);
        $app->forgetScopedInstances();
        $app->instance(AgentContext::class, $context);
        $app->make(CurrentActorSetter::class)->set(
            ActorReference::forAgent($this->agent->id),
            TestStartAuthority::forAgent($this->agent->id),
        );
    }

    /**
     * Opens the session's runtime on the host in the project folder, so a line Core admits has a runner to run in.
     */
    public function openRuntime(Application $app, string $hostId): void
    {
        $intent = new RuntimeIntent(
            $hostId,
            base_path(),
            'claude-code',
            '1.0.0',
            'default',
            DriverType::Headless,
            null,
            null,
            null,
        );
        $app->make(AgentRuntimes::class)->open($this->session, $intent, 'start-token');
    }

    public function openStack(Application $app): void
    {
        $target = new StackTarget($this->agent->id, $this->session->id);
        $stacks = $app->make(SessionStateLifecycle::class);
        $app->make(StartTransaction::class)->runForSession($target->sessionId, fn () => $stacks->open($target));
    }

    /**
     * @return array<string, string>
     */
    public function serverHeaders(
        string $body,
        string $callId = 'call-1',
        int|null $issuedAt = null,
        string|null $signingToken = null,
        string $method = 'POST',
        string $target = '/',
    ): array {
        $issuedAt ??= time();
        $pin = $this->pin();
        $token = $signingToken ?? $this->token;
        $signature = SignedCall::agentSignatureFor($token, $method, $target, $callId, $issuedAt, $body, $pin);

        return [
            'HTTP_AUTHORIZATION' => "Bearer {$this->token}",
            'HTTP_X_JOURNAL_CALL_ID' => $callId,
            'HTTP_X_JOURNAL_CALL_ISSUED_AT' => (string) $issuedAt,
            'HTTP_X_JOURNAL_CALL_SIGNATURE' => $signature,
            'HTTP_X_JOURNAL_PROFILE' => $pin->key,
            'HTTP_X_JOURNAL_PROFILE_REVISION' => (string) $pin->revision,
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
        ];
    }

    /**
     * The profile this start was pinned to, as its calls sign it.
     */
    public function pin(): StartProfilePin
    {
        return new StartProfilePin((string) $this->session->profile_key, (int) $this->session->profile_revision);
    }
}
