<?php

declare(strict_types=1);

namespace App\Http\Middleware\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\PresenceWindow;
use App\Agents\Commands\RecordHeartbeat;
use App\Agents\Exceptions\CallProtocolUnsupported;
use App\Agents\Exceptions\CallSignatureInvalid;
use App\Agents\Exceptions\CredentialRejected;
use App\Agents\Support\AgentContext;
use App\Agents\Support\AgentContextFactory;
use App\Bus\Contracts\CommandBus;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Container\Container;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Authenticates an agent request by its launch credential and signed call, refreshes its session's heartbeat when the
 * stored one is stale, and makes its agent context and its actor the ones for this request only: both are forgotten
 * when it ends. A refused call gets one unauthenticated answer, whichever check failed.
 */
final readonly class AuthenticateAgent
{
    /**
     * The one refusal every failed check gives, so the answer never tells which check failed.
     */
    private const string UNAUTHENTICATED = 'The call could not be authenticated with this launch credential.';

    public function __construct(
        private AgentContextFactory $contexts,
        private Container $container,
        private CurrentActorSetter $actors,
        private CommandBus $commands,
        private PresenceWindow $presence,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $context = $this->contexts->fromRequest($request);
        } catch (CredentialRejected|CallSignatureInvalid) {
            return new JsonResponse(['code' => 'unauthenticated', 'message' => self::UNAUTHENTICATED], Response::HTTP_UNAUTHORIZED);
        } catch (CallProtocolUnsupported $unsupported) {
            return new JsonResponse(['message' => $unsupported->getMessage()], Response::HTTP_UPGRADE_REQUIRED);
        }

        $this->container->instance(AgentContext::class, $context);
        $this->actors->set($context);

        try {
            $this->refreshHeartbeatOf($context);

            return $next($request);
        } finally {
            $this->actors->clear();
            $this->container->forgetInstance(AgentContext::class);
        }
    }

    /**
     * An authenticated call is a sign of life: it records a beat when the stored one is older than the refresh window.
     */
    private function refreshHeartbeatOf(AgentContext $context): void
    {
        if (! $context->heartbeatOlderThan(CarbonImmutable::now()->subSeconds($this->presence->signedCallRefreshSeconds))) {
            return;
        }

        $this->commands->run(new RecordHeartbeat($context->sessionId));
    }
}
