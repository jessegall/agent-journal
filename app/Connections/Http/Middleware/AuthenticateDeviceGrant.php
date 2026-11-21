<?php

declare(strict_types=1);

namespace App\Connections\Http\Middleware;

use App\Actors\Contracts\ActorResolver;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Contracts\JournalAdmission;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Actors\Values\OwnerAuthority;
use App\Connections\Exceptions\DeviceGrantRefused;
use App\Connections\Models\DeviceGrant;
use App\Connections\Values\DeviceCaller;
use App\Connections\Values\InstallTicket;
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
        private JournalAdmission $admission,
        private CurrentActorSetter $actors,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     *
     * @throws DeviceGrantRefused
     */
    public function handle(Request $request, Closure $next): Response
    {
        $grant = DeviceGrant::usable(InstallTicket::digestOf((string) $request->bearerToken()));
        $caller = new DeviceCaller($grant->id, $grant->binding_id, (string) $grant->approved_by_user_id);
        $approver = $this->resolver->get(ActorIdentity::of(ActorContext::forUser($caller->userId)));

        if (! $this->admission->admits($approver)) {
            throw DeviceGrantRefused::approverWithdrawn();
        }

        $this->container->instance(DeviceCaller::class, $caller);
        $this->actors->set($approver, new OwnerAuthority("the terminal sign-in {$caller->grantId}"));

        try {
            return $next($request);
        } finally {
            $this->actors->clear();
            $this->container->forgetInstance(DeviceCaller::class);
        }
    }
}
