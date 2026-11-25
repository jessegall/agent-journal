<?php

declare(strict_types=1);

namespace App\Http\Middleware\Web;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Actors\CurrentUserResolver;
use App\Http\Responses\LoaderProps;
use App\Http\Responses\NotificationProps;
use App\Http\Responses\PageReadProps;
use App\Http\Responses\SearchProps;
use App\Support\Web\AppContext;
use App\Values\InboxMemberAuthority;
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
        private readonly CurrentActor $actors,
        private readonly NotificationProps $notifications,
        private readonly PageReadProps $pageReads,
        private readonly SearchProps $search,
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
            // The one loader call the request names, answered now so it can come back under either key.
            ...$this->loaders->of($request),
            // The bell's notifications, read only by a partial reload that names them.
            ...($this->isInboxMember() ? [] : $this->notifications->of($request)),
            // The keyboard palette's search and its scope picker, read only by a partial reload that names them.
            ...($this->isInboxMember() ? [] : $this->search->of($request)),
            // The reads pages declare beside their own result, each read only by a partial reload that names it.
            ...$this->pageReads->of($request),
        ];
    }

    private function isInboxMember(): bool
    {
        return $this->actors->hasActor() && $this->actors->authority() instanceof InboxMemberAuthority;
    }
}
