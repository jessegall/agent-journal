<?php

declare(strict_types=1);

namespace Domain\Plans\Resolvers;

use App\Contracts\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use Domain\Plans\Http\Requests\PlansRequest;
use Domain\Plans\Support\PlanIndexLayout;

/**
 * The plans window, on Home and on its own page: one page of plans by its search and state, on the shared list recipe,
 * with Nothing selected in its reader.
 */
final readonly class PlansWindowResolver implements PageResolver
{
    public function __construct(
        private PlansRequest $request,
        private PlanIndexLayout $index,
    ) {}

    public function read(): DeclaredLayoutData
    {
        return $this->index->of($this->request->filters(), []);
    }
}
