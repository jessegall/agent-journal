<?php

declare(strict_types=1);

namespace App\Http\Middleware\Agents;

use App\Contracts\HostCalls;
use App\Contracts\LocalProjectHosts;
use App\Enums\CommandEntry;
use App\Enums\HostProtocolVersion;
use App\Exceptions\CallSignatureInvalid;
use App\Exceptions\HostCredentialRejected;
use App\Exceptions\HostProtocolMismatch;
use App\Support\ActorStore;
use App\Support\CommandEntrance;
use App\Values\HostContext;
use Closure;
use Illuminate\Contracts\Container\Container;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Admits a call from an enrolled host that SignedHostCalls verifies, speaking the enrolled hosts' protocol or those
 * the route names: journal.host:2 for a connected project's own routes, journal.host:1,2 for the work routes both
 * speak, where a protocol-2 call must come from a live local-project binding's host and is scoped to it. The host is
 * bound for this request only (Octane), never kept on a singleton.
 */
final readonly class AuthenticateHost
{
    public function __construct(
        private Container $container,
        private HostCalls $calls,
        private LocalProjectHosts $localHosts,
        private ActorStore $actors,
        private CommandEntrance $entrance,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     * @param  string  ...$protocols  the versions the route speaks, journal.host:1,2; none is the enrolled hosts' one
     */
    public function handle(Request $request, Closure $next, string ...$protocols): Response
    {
        $speaks = $protocols === []
            ? [HostProtocolVersion::current()]
            : array_map(fn (string $protocol) => HostProtocolVersion::from((int) $protocol), $protocols);

        try {
            $context = $this->servingContext($this->calls->verify($request, ...$speaks), count($speaks) > 1);
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

    /**
     * On a work route enrolled hosts and connected projects share, a call speaking the connected projects' protocol
     * comes from a host a live local-project binding names, and serves only that binding; any other is refused as
     * speaking a protocol this route does not speak to it.
     *
     * @throws HostProtocolMismatch
     */
    private function servingContext(HostContext $context, bool $isSharedWorkRoute): HostContext
    {
        if (! $isSharedWorkRoute || $context->protocol !== HostProtocolVersion::RemoteProject) {
            return $context;
        }

        foreach ($this->localHosts->liveBindingOf($context->hostId) as $bindingId) {
            return $context->servingBinding($bindingId);
        }

        throw HostProtocolMismatch::speaks((string) $context->protocol->value, HostProtocolVersion::current()->value);
    }
}
