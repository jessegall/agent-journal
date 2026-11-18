<?php

declare(strict_types=1);

namespace App\Http\Controllers\Processes;

use App\Http\Requests\Processes\ApproveSampleRequest;
use App\Http\Responses\Processes\ReviewResponses;
use App\Processes\Commands\ApproveSample;
use Illuminate\Http\RedirectResponse;

/**
 * The owner approves one evidence sample of the request shown.
 */
final readonly class ApproveSamplePageController
{
    public function __invoke(ApproveSampleRequest $form, string $request, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new ApproveSample($request, $form->expectedRevision(), $form->commandDigest()));
    }
}
