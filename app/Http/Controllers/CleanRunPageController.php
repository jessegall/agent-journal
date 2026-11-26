<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\Http\Requests\Processes\RunPageRequest;
use App\Http\Responses\Processes\ReviewResponses;
use App\Processes\Commands\CleanProcessOutput\CleanProcessOutputCommand;
use Illuminate\Http\RedirectResponse;

/**
 * Removes the stored output of the run shown, after the page showed how many bytes go.
 */
final readonly class CleanRunPageController
{
    #[Dispatches(CleanProcessOutputCommand::class)]
    public function __invoke(RunPageRequest $request, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new CleanProcessOutputCommand([$request->runId()], false));
    }
}
