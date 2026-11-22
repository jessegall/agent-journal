<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Sharing\ApproveProposalRequest;
use App\Support\ShareOpener;
use Illuminate\Http\RedirectResponse;

/**
 * Approves an agent's proposal from the owner's saved preview through the bus and opens the share's page.
 */
final readonly class ApproveShareRequestController
{
    public function __invoke(ApproveProposalRequest $request, ShareOpener $shares): RedirectResponse
    {
        return $shares->approve($request->command());
    }
}
