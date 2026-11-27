<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Access\Contracts\AuthoritySource;
use App\Access\Contracts\JournalAdmission;
use App\Access\Values\OwnerAuthority;
use App\Actors\Contracts\Actor;
use App\Actors\Contracts\CurrentActorSetter;
use App\Exceptions\JournalAccessDenied;
use App\Inboxes\Contracts\InboxEligibility;
use App\Inboxes\Contracts\InboxMemberRoutes;
use App\Support\ActorReference;
use App\Values\InboxMemberAuthority;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Makes the signed-in user the actor of this request, after the journal access policy lets them in. It runs after
 * the session authentication and before route binding, so nothing is read for a user who may not use the journal.
 */
final readonly class AuthenticateUser
{
    public function __construct(
        private JournalAdmission $admission,
        private InboxEligibility $inboxes,
        private InboxMemberRoutes $memberRoutes,
        private CurrentActorSetter $actors,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user instanceof Actor) {
            throw JournalAccessDenied::forUser();
        }

        $this->actors->set($user, $this->authorityOf($user, $request));

        try {
            return $next($request);
        } finally {
            $this->actors->clear();
        }
    }

    /**
     * The owner gets the owner's authority; a user admitted to inboxes gets an inbox member's, on the routes opened to
     * inbox members alone.
     *
     * @throws JournalAccessDenied
     */
    private function authorityOf(Actor $user, Request $request): AuthoritySource
    {
        if ($this->admission->admits($user)) {
            return new OwnerAuthority('the web sign-in');
        }

        if (! $this->inboxes->isAdmitted(ActorReference::of($user)) || ! $this->isMemberRoute($request)) {
            throw JournalAccessDenied::forUser();
        }

        return new InboxMemberAuthority('the web sign-in');
    }

    private function isMemberRoute(Request $request): bool
    {
        $route = $request->route();

        if ($route === null) {
            return false;
        }

        return $this->memberRoutes->admits((string) $route->getName());
    }
}
