<?php

declare(strict_types=1);

namespace Tests\Fixtures\Agents;

use App\Core\AgentRequests\Support\SignedCall;
use App\Core\Agents\Actions\AgentSessions;
use App\Core\Agents\Actions\LaunchCredentials;
use App\Core\Agents\Lifecycle\AgentLifecycle;
use App\Core\Agents\Models\Agent;
use App\Core\Agents\Models\AgentSession;

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
        $agent = Agent::query()->create(['name' => 'Test agent', 'role' => $role]);
        $session = (new AgentSessions(new AgentLifecycle))->start($agent);

        return new self($agent, $session, (new LaunchCredentials)->issue($session));
    }

    /**
     * @return array<string, string>
     */
    public function serverHeaders(string $body, string $callId = 'call-1', int|null $issuedAt = null, string|null $signingToken = null): array
    {
        $issuedAt ??= time();
        $signature = SignedCall::signatureFor($signingToken ?? $this->token, $callId, $issuedAt, SignedCall::digestOf($body));

        return [
            'HTTP_AUTHORIZATION' => "Bearer {$this->token}",
            'HTTP_X_JOURNAL_CALL_ID' => $callId,
            'HTTP_X_JOURNAL_CALL_ISSUED_AT' => (string) $issuedAt,
            'HTTP_X_JOURNAL_CALL_SIGNATURE' => $signature,
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
        ];
    }
}
