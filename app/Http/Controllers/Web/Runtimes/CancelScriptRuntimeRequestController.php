<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web\Runtimes;

use App\Agents\Commands\CancelKeyScript;
use App\Http\Requests\Web\RequestRecoveryRequest;
use App\Http\Responses\Processes\ReviewResponses;
use Illuminate\Http\RedirectResponse;

/**
 * The owner cancels a stopped key script; a refusal is shown on the page.
 */
final readonly class CancelScriptRuntimeRequestController
{
    public function __invoke(RequestRecoveryRequest $request, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new CancelKeyScript($request->requestId(), $request->rowVersion(), $request->reason()));
    }
}
