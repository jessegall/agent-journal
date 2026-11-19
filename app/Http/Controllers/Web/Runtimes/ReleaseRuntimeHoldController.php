<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web\Runtimes;

use App\Agents\Commands\ReleaseAgentHold;
use App\Http\Requests\Web\HoldReleaseRequest;
use App\Http\Responses\Processes\ReviewResponses;
use Illuminate\Http\RedirectResponse;

/**
 * The owner releases the interrupt or call for attention shown on a runtime; a refusal is shown on the page.
 */
final readonly class ReleaseRuntimeHoldController
{
    public function __invoke(HoldReleaseRequest $request, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new ReleaseAgentHold(
            $request->agentId(),
            $request->sessionId(),
            $request->hold(),
            $request->reason(),
        ));
    }
}
