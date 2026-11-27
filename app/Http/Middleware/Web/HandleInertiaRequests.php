<?php

declare(strict_types=1);

namespace App\Http\Middleware\Web;

use App\Actors\Contracts\CurrentUserResolver;
use App\Http\Responses\LoaderProps;
use App\Web\AppContext;
use Closure;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Inertia\ResponseFactory;
use Symfony\Component\HttpFoundation\Response;

/**
 * The one Inertia middleware: the root view, the asset version and the app context every page receives.
 */
class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    public function __construct(
        private readonly AppContext $context,
        private readonly LoaderProps $loaders,
        private readonly CurrentUserResolver $users,
        private readonly ResponseFactory $inertia,
    ) {}

    /**
     * Every page a signed-in viewer sees is kept encrypted in the browser's history, so going back after signing out
     * shows nothing private; a guest's pages are not, set on every request since the factory outlives one. The answer
     * to a loader call is never cached.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $this->inertia->encryptHistory($this->users->currentUser()->isDefined());
        $response = parent::handle($request, $next);

        if (LoaderProps::isCall($request)) {
            $response->headers->set('Cache-Control', 'no-store, private');
        }

        return $response;
    }

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            ...$this->context->data($request)->toArray(),
            ...$this->loaders->of($request),
        ];
    }
}
