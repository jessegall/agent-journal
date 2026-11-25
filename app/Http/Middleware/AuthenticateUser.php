<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Contracts\Actors\Actor;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Admission\JournalAdmission;
use App\Contracts\Authorization\AuthoritySource;
use App\Contracts\Inboxes\InboxEligibility;
use App\Support\ActorIdentity;
use App\Values\InboxMemberAuthority;
use App\Values\OwnerAuthority;
use Closure;
use App\Exceptions\JournalAccessDenied;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Makes the signed-in user the actor of this request, after the journal access policy lets them in. It runs after
 * the session authentication and before route binding, so nothing is read for a user who may not use the journal.
 */
final readonly class AuthenticateUser
{
    /**
     * The routes a chat member may open: the chat window, its actions and the message reads behind them.
     */
    private const array CHAT_ROUTE_PREFIXES = [
        'chat.',
        'communication.',
    ];

    public function __construct(
        private JournalAdmission $admission,
        private InboxEligibility $chats,
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
     * The owner gets the owner's authority; a user admitted to chats gets a chat member's, on chat routes alone.
     *
     * @throws JournalAccessDenied
     */
    private function authorityOf(Actor $user, Request $request): AuthoritySource
    {
        if ($this->admission->admits($user)) {
            return new OwnerAuthority('the web sign-in');
        }

        if (! $this->chats->isAdmitted(ActorIdentity::of($user), null) || ! $this->isChatRoute($request)) {
            throw JournalAccessDenied::forUser();
        }

        return new InboxMemberAuthority('the web sign-in');
    }

    private function isChatRoute(Request $request): bool
    {
        $name = (string) $request->route()?->getName();

        return array_any(self::CHAT_ROUTE_PREFIXES, fn (string $prefix) => str_starts_with($name, $prefix));
    }
}
