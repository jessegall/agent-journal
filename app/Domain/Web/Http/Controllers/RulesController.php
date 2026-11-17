<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Controllers;

use App\Domain\Web\Http\Requests\RulesRequest;
use App\Domain\Web\Pages\RulesPage;
use Inertia\Response;
use Inertia\ResponseFactory;

/**
 * Shows the rules page; the page object is built only when the page prop is asked for.
 */
final readonly class RulesController
{
    public function __construct(private ResponseFactory $inertia) {}

    public function index(RulesRequest $request): Response
    {
        return $this->inertia->render(RulesPage::COMPONENT, ['page' => fn () => RulesPage::for($request->filters())]);
    }
}
