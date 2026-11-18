<?php

declare(strict_types=1);

namespace App\Http\Controllers\Processes;

use App\Http\Requests\Processes\ReviewRequest;
use App\Http\Responses\Processes\ReviewResponses;
use App\Processes\Commands\RejectRuleProposal;
use Illuminate\Http\RedirectResponse;

/**
 * The owner rejects a proposal of the request shown, with the reason its author hears.
 */
final readonly class RejectProposalPageController
{
    public function __invoke(ReviewRequest $form, string $proposal, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new RejectRuleProposal($proposal, $form->reason()));
    }
}
