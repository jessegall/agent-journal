<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\Http\Requests\Processes\RunPageRequest;
use App\Http\Responses\Processes\ReviewResponses;
use App\Processes\Commands\VerifyRestoredOutput\VerifyRestoredOutputCommand;
use Illuminate\Http\RedirectResponse;

/**
 * Checks the run shown against its original chunk checksums after its output was restored to the disk.
 */
final readonly class VerifyRestoredOutputPageController
{
    #[Dispatches(VerifyRestoredOutputCommand::class)]
    public function __invoke(RunPageRequest $request, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new VerifyRestoredOutputCommand($request->runId()));
    }
}
