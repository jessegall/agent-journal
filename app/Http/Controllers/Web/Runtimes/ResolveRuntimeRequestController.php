<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web\Runtimes;

use App\Agents\Commands\ResolveDriverDelivery;
use App\Http\Requests\Web\RequestRecoveryRequest;
use App\Http\Responses\Processes\ReviewResponses;
use Illuminate\Http\RedirectResponse;

/**
 * The owner says, from evidence, whether an uncertain delivery arrived; a refusal is shown on the page.
 */
final readonly class ResolveRuntimeRequestController
{
    public function __invoke(RequestRecoveryRequest $request, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new ResolveDriverDelivery(
            $request->requestId(),
            $request->rowVersion(),
            $request->applied(),
            $request->reason(),
        ));
    }
}
