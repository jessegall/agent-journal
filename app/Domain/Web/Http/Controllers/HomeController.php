<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Controllers;

use App\Domain\Web\Http\Requests\DeclaredPageRequest;
use App\Domain\Web\Http\Requests\HomeRequest;
use App\Domain\Web\Pages\HomePage;
use App\Domain\Web\Support\PageProps;
use Inertia\Response;
use Inertia\ResponseFactory;

/**
 * Shows Home; the page object is built only when the page prop is asked for.
 */
final readonly class HomeController
{
    public function __construct(private ResponseFactory $inertia) {}

    /**
     * Home's own page, and one optional prop per declared window, which the browser asks for once it shows that window.
     */
    public function __invoke(HomeRequest $request, DeclaredPageRequest $pageRequest, PageProps $windows): Response
    {
        return $this->inertia->render(HomePage::COMPONENT, ['page' => fn () => HomePage::for($request->filters()), ...$windows->forHome($pageRequest)]);
    }
}
