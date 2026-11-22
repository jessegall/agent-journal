<?php

declare(strict_types=1);

namespace App\Http\Controllers\Runtimes;

use App\Commands\ResumeKeyScript\ResumeKeyScriptCommand;
use App\Http\Requests\Web\RequestRecoveryRequest;
use App\Http\Responses\Processes\ReviewResponses;
use Illuminate\Http\RedirectResponse;

/**
 * The owner lets a stopped key script go on from its recorded step; a refusal is shown on the page.
 */
final readonly class ResumeScriptRuntimeRequestController
{
    public function __invoke(RequestRecoveryRequest $request, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new ResumeKeyScriptCommand($request->requestId(), $request->rowVersion(), $request->reason()));
    }
}
