<?php

declare(strict_types=1);

namespace App\Http\Middleware\Agents;

use App\Actors\Support\ActorStore;
use App\Agents\Contracts\HostCalls;
use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Exceptions\CallSignatureInvalid;
use App\Agents\Exceptions\HostCredentialRejected;
use App\Agents\Exceptions\HostProtocolMismatch;
use App\Agents\Values\HostContext;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\CommandEntrance;
use Closure;
use Illuminate\Contracts\Container\Container;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Admits a call from an enrolled host that SignedHostCalls verifies, speaking the enrolled hosts' protocol or the one
 * the route names, such as journal.host:2 for a connected project's relay. The host is
 * bound for this request only (Octane), never kept on a singleton.
 */
final readonly class AuthenticateHost
{
    public function __construct(
        private Container $container,
        private HostCalls $calls,
        private ActorStore $actors,
        private CommandEntrance $entrance,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next, string|null $protocol = null): Response
    {
        $speaks = $protocol === null ? HostProtocolVersion::current() : HostProtocolVersion::from((int) $protocol);

        try {
            $context = $this->calls->verify($request, $speaks);
        } catch (HostCredentialRejected|CallSignatureInvalid $rejection) {
            return new JsonResponse(['message' => $rejection->getMessage()], Response::HTTP_UNAUTHORIZED);
        } catch (HostProtocolMismatch $mismatch) {
            return new JsonResponse([
                'message' => $mismatch->getMessage(),
                'protocolVersions' => HostProtocolVersion::spoken(),
            ], Response::HTTP_UPGRADE_REQUIRED);
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
}
