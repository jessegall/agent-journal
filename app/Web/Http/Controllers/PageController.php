<?php

declare(strict_types=1);

namespace App\Web\Http\Controllers;

use App\Ui\Support\UiDeclarations;
use App\Web\Http\DeclaredRouteKey;
use App\Web\Http\PageProps;
use App\Web\Http\Requests\DeclaredPageRequest;
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
