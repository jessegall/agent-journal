<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\Runs\CleanProcessOutput\CleanProcessOutputCommand;
use App\Http\Requests\Processes\RunPageRequest;
use App\Http\Responses\Processes\ReviewResponses;
use Illuminate\Http\RedirectResponse;

/**
 * Removes the stored output of the run shown, after the page showed how many bytes go.
 */
final readonly class CleanRunPageController
{
    public function __invoke(RunPageRequest $request, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new CleanProcessOutputCommand([$request->runId()], false));
    }
}
