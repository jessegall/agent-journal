<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web\Runtimes;

use App\Agents\Commands\RetryDriverRequest;
use App\Http\Requests\Web\RequestRecoveryRequest;
use App\Http\Responses\Processes\ReviewResponses;
use Illuminate\Http\RedirectResponse;

/**
 * The owner sends a failed or unavailable request again; a refusal is shown on the page.
 */
final readonly class RetryRuntimeRequestController
{
    public function __invoke(RequestRecoveryRequest $request, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new RetryDriverRequest($request->requestId(), $request->rowVersion(), $request->reason()));
    }
}
