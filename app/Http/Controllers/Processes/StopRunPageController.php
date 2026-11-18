<?php

declare(strict_types=1);

namespace App\Http\Controllers\Processes;

use App\Http\Requests\Processes\RunPageRequest;
use App\Http\Responses\Processes\ReviewResponses;
use App\Processes\Commands\StopProcessRun;
use Illuminate\Http\RedirectResponse;

/**
 * A viewer stops the run shown; a refusal is shown on the page.
 */
final readonly class StopRunPageController
{
    public function __invoke(RunPageRequest $request, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new StopProcessRun($request->runId(), 'stopped from the run page'));
    }
}
