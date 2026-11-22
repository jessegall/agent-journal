<?php

declare(strict_types=1);

namespace App\Http\Middleware\Web;

use App\Support\Web\DeclaredRouteKey;
use App\Support\Web\PageVisibility;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Lets a declared page or action run only when the signed-in actor passes every visibility check of the page or
 * section that guards it and its domain is available; a refused actor or a switched-off domain gets the same plain 404
 * as a page that does not exist.
 */
final readonly class CheckPageVisibility
{
    public function __construct(private PageVisibility $visibility) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next, string $key): Response
    {
        $this->visibility->assertVisible($key);

        // The key is no route value of the owner's controller, so it is kept out of the parameters it receives.
        $request->route()?->forgetParameter(DeclaredRouteKey::NAME);

        return $next($request);
    }
}
