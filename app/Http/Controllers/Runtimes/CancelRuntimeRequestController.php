<?php

declare(strict_types=1);

namespace App\Http\Controllers\Runtimes;

use App\Commands\Drivers\CancelDriverRequest\CancelDriverRequestCommand;
use App\Http\Requests\Web\RequestRecoveryRequest;
use App\Http\Responses\Processes\ReviewResponses;
use Illuminate\Http\RedirectResponse;

/**
 * The owner cancels a request that has not started; a refusal is shown on the page.
 */
final readonly class CancelRuntimeRequestController
{
    public function __invoke(RequestRecoveryRequest $request, ReviewResponses $review): RedirectResponse
    {
        return $review->run(
            new CancelDriverRequestCommand($request->requestId(), $request->rowVersion(), $request->reason()),
        );
    }
}
