<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Controllers;

use App\Domain\Web\Http\Requests\HomeRequest;
use App\Domain\Web\Pages\HomePage;
use Inertia\Response;
use Inertia\ResponseFactory;

/**
 * Shows Home; the page object is built only when the page prop is asked for.
 */
final readonly class HomeController
{
    public function __construct(private ResponseFactory $inertia) {}

    public function __invoke(HomeRequest $request): Response
    {
        return $this->inertia->render(HomePage::COMPONENT, ['page' => fn () => HomePage::for($request->filters())]);
    }
}
