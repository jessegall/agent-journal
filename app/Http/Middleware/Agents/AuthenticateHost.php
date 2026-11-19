<?php

declare(strict_types=1);

namespace App\Http\Middleware\Agents;

use App\Actors\Support\ActorStore;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Exceptions\CallSignatureInvalid;
use App\Agents\Exceptions\HostCredentialRejected;
use App\Agents\Models\Host;
use App\Agents\Support\HostContext;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\CommandEntrance;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Contracts\Cache\Repository;
use Illuminate\Contracts\Container\Container;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Admits a call from an enrolled host: its credential, an HMAC over method, path, call id, issue time and body (the
 * agent call envelope), an issue time inside the window, and a call id not used before inside that window. The host
 * is bound for this request only (Octane), never kept on a singleton.
 */
final readonly class AuthenticateHost
{
    private const int WINDOW_SECONDS = 300;

    public function __construct(
        private Container $container,
        private Repository $cache,
        private ActorStore $actors,
        private CommandEntrance $entrance,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $context = $this->verified($request);
        } catch (HostCredentialRejected|CallSignatureInvalid $rejection) {
            return new JsonResponse(['message' => $rejection->getMessage()], Response::HTTP_UNAUTHORIZED);
        }

        $this->container->instance(HostContext::class, $context);

        try {
            $handle = fn (): Response => $next($request);

            return $this->entrance->through(
                CommandEntry::HostControl,
                fn (): Response => $this->actors->actAsSystem('host request', $handle),
            );
        } finally {
            $this->container->forgetInstance(HostContext::class);
        }
    }

    private function verified(Request $request): HostContext
    {
        $secret = $request->bearerToken() ?? throw HostCredentialRejected::missing();
        $callId = $this->header($request, SignedCall::ID_HEADER);
        $issuedAt = (int) $this->header($request, SignedCall::ISSUED_AT_HEADER);
        $signature = $this->header($request, SignedCall::SIGNATURE_HEADER);

        if (! hash_equals(SignedCall::signatureFor($secret, $request->getMethod(), $request->getRequestUri(), $callId, $issuedAt, $request->getContent()), $signature)) {
            throw CallSignatureInvalid::mismatched($callId);
        }

        if (abs(CarbonImmutable::now()->getTimestamp() - $issuedAt) > self::WINDOW_SECONDS) {
            throw HostCredentialRejected::stale($issuedAt);
        }

        $host = Host::forSecret($secret);

        if (! $this->cache->add("host-call:{$host->id}:{$callId}", true, self::WINDOW_SECONDS * 2)) {
            throw HostCredentialRejected::replayed($callId);
        }

        return new HostContext(
            $host->id,
            new SignedCall($callId, CarbonImmutable::createFromTimestamp($issuedAt), SignedCall::digestOf($request->getContent())),
        );
    }

    private function header(Request $request, string $name): string
    {
        return $request->headers->get($name) ?? throw CallSignatureInvalid::missing($name);
    }
}
