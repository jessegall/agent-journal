<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Pages;

use App\Reads\PageFormRequests;
use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Contracts\PageBuilder;
use Domain\Plans\Http\Pages\Plans\PlansIndex;
use Domain\Plans\Http\Requests\PlansRequest;
use Illuminate\Http\Request;

/**
 * The plans window, on Home and on its own page: one page of plans by its search and state, on the shared list recipe,
 * with Nothing selected in its reader.
 */
final readonly class PlansPageBuilder implements PageBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private PlansIndex $index,
    ) {}

    public function build(Request $visit): PlansPageData
    {
        return PlansPageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): DeclaredLayoutData
    {
        $input = $this->requests->from(PlansRequest::class, $visit);

        return $this->index->of($input->filters(), []);
    }
}
