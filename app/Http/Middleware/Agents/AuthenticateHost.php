<?php

declare(strict_types=1);

namespace App\Http\Middleware\Agents;

use App\Contracts\Hosts\HostCalls;
use App\Contracts\Hosts\LocalProjectHosts;
use App\Enums\CommandEntry;
use App\Enums\HostRouteRole;
use App\Exceptions\CallSignatureInvalid;
use App\Exceptions\HostCredentialRejected;
use App\Exceptions\HostRoleRefused;
use App\Models\Host;
use App\Support\ActorStore;
use App\Support\CommandEntrance;
use App\Values\HostContext;
use Closure;
use Illuminate\Contracts\Container\Container;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Admits a signed host call (SignedHostCalls) from the hosts the route's role names: enrolled hosts by default,
 * journal.host:relay for a connected folder's own routes, journal.host:shared for the work routes both use, where a
 * relay must have a live binding and is scoped to it. The host is bound for this request only (Octane), never kept on
 * a singleton.
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
     * @param  string  $role  the hosts the route admits, journal.host:relay or journal.host:shared; none is enrolled hosts
     */
    public function handle(Request $request, Closure $next, string $role = HostRouteRole::Enrolled->value): Response
    {
        try {
            $context = $this->servingContext($this->calls->verify($request), HostRouteRole::from($role));
        } catch (HostCredentialRejected|CallSignatureInvalid $rejection) {
            return new JsonResponse(['message' => $rejection->getMessage()], Response::HTTP_UNAUTHORIZED);
        } catch (HostRoleRefused $refusal) {
            return new JsonResponse(['message' => $refusal->getMessage()], Response::HTTP_FORBIDDEN);
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
     * The call as the route admits it: an enrolled host as it is, a relay only where the route admits relays, and on a
     * route both share only as the relay of its live binding.
     *
     * @throws HostRoleRefused
     */
    private function servingContext(HostContext $context, HostRouteRole $role): HostContext
    {
        if (! Host::query()->findOrFail($context->hostId)->isConnectedFolderRelay()) {
            return $role->isForEnrolledHosts() ? $context : throw HostRoleRefused::forRelayOnly($context->hostId);
        }

        if (! $role->isForRelays()) {
            throw HostRoleRefused::forEnrolledOnly($context->hostId);
        }

        if (! $role->isForEnrolledHosts()) {
            return $context;
        }

        foreach ($this->localHosts->liveBindingOf($context->hostId) as $bindingId) {
            return $context->servingBinding($bindingId);
        }

        throw HostRoleRefused::forNoLiveBinding($context->hostId);
    }
}
