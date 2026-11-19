<?php

declare(strict_types=1);

namespace App\Web\Http\Controllers\Runtimes;

use App\Agents\Commands\ResumeKeyScript;
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
        return $review->run(new ResumeKeyScript($request->requestId(), $request->rowVersion(), $request->reason()));
    }
}
