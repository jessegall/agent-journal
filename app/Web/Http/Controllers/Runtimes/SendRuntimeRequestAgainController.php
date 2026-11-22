<?php

declare(strict_types=1);

namespace App\Web\Http\Controllers\Runtimes;

use App\Agents\Commands\SendDriverRequestAgain\SendDriverRequestAgainCommand;
use App\Http\Requests\Web\RequestRecoveryRequest;
use App\Http\Responses\Processes\ReviewResponses;
use Illuminate\Http\RedirectResponse;

/**
 * The owner sends an uncertain delivery again from the runtime status page, having confirmed it may arrive twice.
 */
final readonly class SendRuntimeRequestAgainController
{
    public function __invoke(RequestRecoveryRequest $request, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new SendDriverRequestAgainCommand(
            $request->requestId(),
            $request->confirmsPossibleDuplicate(),
            $request->reason(),
        ));
    }
}
