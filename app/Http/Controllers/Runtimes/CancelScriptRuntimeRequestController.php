<?php

declare(strict_types=1);

namespace App\Http\Controllers\Runtimes;

use App\Bus\Attributes\Dispatches;
use App\Http\Requests\Web\RequestRecoveryRequest;
use App\Http\Responses\Processes\ReviewResponses;
use App\Terminals\Commands\CancelKeyScript\CancelKeyScriptCommand;
use Illuminate\Http\RedirectResponse;

/**
 * The owner cancels a stopped key script; a refusal is shown on the page.
 */
final readonly class CancelScriptRuntimeRequestController
{
    #[Dispatches(CancelKeyScriptCommand::class)]
    public function __invoke(RequestRecoveryRequest $request, ReviewResponses $review): RedirectResponse
    {
        return $review->run(
            new CancelKeyScriptCommand($request->requestId(), $request->rowVersion(), $request->reason()),
        );
    }
}
