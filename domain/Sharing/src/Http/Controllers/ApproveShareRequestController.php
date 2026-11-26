<?php

declare(strict_types=1);

namespace Domain\Sharing\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use Domain\Sharing\Commands\ApproveShareRequest\ApproveShareRequestCommand;
use Domain\Sharing\Http\Requests\ApproveProposalRequest;
use Domain\Sharing\Support\ShareOpener;
use Illuminate\Http\RedirectResponse;

/**
 * Approves an agent's proposal from the owner's saved preview through the bus and opens the share's page.
 */
final readonly class ApproveShareRequestController
{
    #[Dispatches(ApproveShareRequestCommand::class)]
    public function __invoke(ApproveProposalRequest $request, ShareOpener $shares): RedirectResponse
    {
        return $shares->approve($request->command());
    }
}
