<?php

declare(strict_types=1);

namespace App\Http\Middleware\Sharing;

use App\Http\Responses\Sharing\SharedPageResponses;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Lets only plain GET and HEAD requests reach a share, refuses any connection upgrade, and forgets every incoming
 * cookie, so no owner or agent session can ride along.
 */
final readonly class GuardShareRequest
{
    private const array METHODS = [
        'GET',
        'HEAD',
    ];

    public function __construct(private SharedPageResponses $responses) {}

    public function handle(Request $request, Closure $next): Response
    {
        if (! in_array($request->getMethod(), self::METHODS, true)) {
            return $this->responses->refused(405);
        }

        if ($request->headers->has('Upgrade')) {
            return $this->responses->refused(400);
        }

        $request->cookies->replace([]);
        $request->headers->remove('Cookie');

        return $next($request);
    }
}
