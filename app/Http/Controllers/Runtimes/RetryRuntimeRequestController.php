<?php

declare(strict_types=1);

namespace App\Http\Controllers\Runtimes;

use App\Agents\Drivers\Commands\RetryDriverRequest\RetryDriverRequestCommand;
use App\Bus\Attributes\Dispatches;
use App\Http\Requests\Web\RequestRecoveryRequest;
use App\Http\Responses\Processes\ReviewResponses;
use Illuminate\Http\RedirectResponse;

/**
 * The owner sends a failed or unavailable request again; a refusal is shown on the page.
 */
final readonly class RetryRuntimeRequestController
{
    #[Dispatches(RetryDriverRequestCommand::class)]
    public function __invoke(RequestRecoveryRequest $request, ReviewResponses $review): RedirectResponse
    {
        return $review->run(
            new RetryDriverRequestCommand($request->requestId(), $request->rowVersion(), $request->reason()),
        );
    }
}
