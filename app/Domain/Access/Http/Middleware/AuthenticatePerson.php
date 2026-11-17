<?php

declare(strict_types=1);

namespace App\Domain\Access\Http\Middleware;

use App\Core\Actors\Actor;
use App\Core\Actors\EstablishActor;
use App\Domain\Access\Exceptions\JournalAccessDenied;
use App\Domain\Access\JournalAccessPolicy;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Makes the signed-in person the actor of this request, after the journal access policy lets them in. It runs after
 * the session authentication and before route binding, so nothing is read for a person who may not use the journal.
 */
final readonly class AuthenticatePerson
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
        $person = $request->user();

        if (! $person instanceof Actor || ! $this->access->allows($person)) {
            throw JournalAccessDenied::forPerson();
        }

        $this->actors->establish($person);

        try {
            return $next($request);
        } finally {
            $this->actors->clear();
        }
    }
}
