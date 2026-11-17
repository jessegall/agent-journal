<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Controllers;

use App\Domain\Web\Http\Requests\PlansRequest;
use App\Domain\Web\Pages\PlansPage;
use Inertia\Response;
use Inertia\ResponseFactory;

/**
 * Shows the plans page; the page object is built only when the page prop is asked for.
 */
final readonly class PlansController
{
    public function __construct(private ResponseFactory $inertia) {}

    public function index(PlansRequest $request): Response
    {
        return $this->inertia->render(PlansPage::COMPONENT, ['page' => fn () => PlansPage::for($request->filters())]);
    }
}
