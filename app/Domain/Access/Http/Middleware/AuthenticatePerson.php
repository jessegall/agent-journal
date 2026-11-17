<?php

declare(strict_types=1);

namespace App\Domain\Access\Http\Middleware;

use App\Core\Actors\ActorContext;
use App\Domain\Access\Exceptions\JournalAccessDenied;
use App\Domain\Access\JournalAccess;
use App\Domain\Access\Models\User;
use Closure;
use Illuminate\Contracts\Container\Container;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Makes the signed-in person the actor of this request, after the journal access policy lets them in. It runs after
 * the session authentication and before route binding, so nothing is read for a person who may not use the journal.
 */
final readonly class AuthenticatePerson
{
    public function __construct(
        private JournalAccess $access,
        private Container $container,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $person = $request->user();

        if (! $person instanceof User || ! $this->access->allows($person)) {
            throw JournalAccessDenied::forPerson();
        }

        $this->container->instance(ActorContext::class, ActorContext::forPerson($person->id));

        return $next($request);
    }
}
