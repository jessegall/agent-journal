<?php

declare(strict_types=1);

namespace App\Http\Controllers\Runtimes;

use App\Commands\ResolveDriverDelivery\ResolveDriverDeliveryCommand;
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
        return $review->run(new ResolveDriverDeliveryCommand(
            $request->requestId(),
            $request->rowVersion(),
            $request->isApplied(),
            $request->reason(),
        ));
    }
}
