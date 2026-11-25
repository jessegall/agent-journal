<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Contracts\Actors\Actor;
use App\Contracts\Actors\ActorResolver;
use App\Contracts\Actors\CurrentActorSetter;
use App\Exceptions\ActorUnavailable;
use App\Exceptions\DeviceGrantRefused;
use App\Models\Projects\DeviceGrant;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Values\DeviceCaller;
use App\Values\InstallTicket;
use App\Values\OwnerAuthority;
use Closure;
use Illuminate\Contracts\Container\Container;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Admits a terminal's call under its device grant: the grant must be issued, unexpired and of a binding not revoked,
 * and the user who approved it must still be one the journal admits. That user is the actor of the request, so every
 * verb meets the ordinary policies as them, and the caller is bound for this request only (Octane).
 */
final readonly class AuthenticateDeviceGrant
{
    public function __construct(
        private Container $container,
        private ActorResolver $resolver,
        private CurrentActorSetter $actors,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     *
     * @throws DeviceGrantRefused
     */
    public function handle(Request $request, Closure $next): Response
    {
        $grant = DeviceGrant::findUsableByDigest(InstallTicket::digestOf((string) $request->bearerToken()));
        $caller = new DeviceCaller($grant->id, $grant->binding_id, (string) $grant->approved_by_user_id);
        $approver = $this->approverOf($caller);

        $this->container->instance(DeviceCaller::class, $caller);
        $this->actors->set($approver, new OwnerAuthority("the terminal sign-in {$caller->grantId}"));

        try {
            return $next($request);
        } finally {
            $this->actors->clear();
            $this->container->forgetInstance(DeviceCaller::class);
        }
    }

    /**
     * The user who approved the grant, as an actor: the resolver admits only a user that exists and that the journal
     * still lets in, and a user it refuses withdrew the grant's approval.
     *
     * @throws DeviceGrantRefused
     */
    private function approverOf(DeviceCaller $caller): Actor
    {
        try {
            return $this->resolver->get(ActorIdentity::of(ActorContext::forUser($caller->userId)));
        } catch (ActorUnavailable $unavailable) {
            throw DeviceGrantRefused::approverWithdrawn($unavailable);
        }
    }
}
