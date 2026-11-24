<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\CommandRules\ApproveSample\ApproveSampleCommand;
use App\Http\Requests\Processes\ApproveSampleRequest;
use App\Http\Responses\Processes\ReviewResponses;
use Illuminate\Http\RedirectResponse;

/**
 * The owner approves one evidence sample of the request shown.
 */
final readonly class ApproveSamplePageController
{
    public function __invoke(ApproveSampleRequest $form, string $request, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new ApproveSampleCommand($request, $form->expectedRevision(), $form->commandDigest()));
    }
}
