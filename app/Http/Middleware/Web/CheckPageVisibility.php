<?php

declare(strict_types=1);

namespace App\Http\Middleware\Web;

use App\Contracts\CurrentActor;
use App\Contracts\UiOwnerAvailability;
use App\Support\UiDeclarations;
use App\Support\Web\DeclaredRouteKey;
use Closure;
use Illuminate\Contracts\Container\Container;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Lets a declared page or action run only when the signed-in actor passes every visibility check of the page or
 * section that guards it and its domain is available; a refused actor or a switched-off domain gets the same plain 404
 * as a page that does not exist.
 */
final readonly class CheckPageVisibility
{
    public function __construct(
        private UiDeclarations $declarations,
        private CurrentActor $actors,
        private Container $container,
        private UiOwnerAvailability $owners,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next, string $key): Response
    {
        if (! $this->owners->isAvailable($this->declarations->ownerOf($key))) {
            throw new NotFoundHttpException();
        }

        $actor = $this->actors->actor();

        foreach ($this->declarations->visibilityChecksOf($key) as $checkClass) {
            if (! $this->container->make($checkClass)->allows($actor)) {
                throw new NotFoundHttpException();
            }
        }

        // The key is no route value of the owner's controller, so it is kept out of the parameters it receives.
        $request->route()?->forgetParameter(DeclaredRouteKey::NAME);

        return $next($request);
    }
}
