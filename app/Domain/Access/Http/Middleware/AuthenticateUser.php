<?php

declare(strict_types=1);

namespace App\Domain\Access\Http\Middleware;

use App\Core\Contracts\Actor;
use App\Core\Contracts\EstablishActor;
use App\Domain\Access\Contracts\JournalAccessPolicy;
use App\Domain\Access\Exceptions\JournalAccessDenied;
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
        private JournalAccessPolicy $access,
        private EstablishActor $actors,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user instanceof Actor || ! $this->access->allows($user)) {
            throw JournalAccessDenied::forUser();
        }

        $this->actors->establish($user);

        try {
            return $next($request);
        } finally {
            $this->actors->clear();
        }
    }
}
