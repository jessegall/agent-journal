<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Http\Requests\Web\DeclaredPageRequest;
use App\Http\Support\Web\DeclaredRouteKey;
use App\Http\Support\Web\PageProps;
use App\Ui\Support\UiDeclarations;
use Illuminate\Routing\Route;
use Inertia\Response;
use Inertia\ResponseFactory;

/**
 * Serves every declared page: the route says which page, and the page's own declaration says what it shows.
 */
final readonly class PageController
{
    public function __construct(
        private UiDeclarations $declarations,
        private ResponseFactory $inertia,
    ) {}

    public function __invoke(Route $route, DeclaredPageRequest $request, PageProps $props): Response
    {
        $page = $this->declarations->page(DeclaredRouteKey::of($route));

        return $this->inertia->render($page->componentName(), $props->forPage($page, $request));
    }
}
