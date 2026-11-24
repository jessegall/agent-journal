<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\CommandRules\ApproveRuleProposal\ApproveRuleProposalCommand;
use App\Http\Requests\Processes\ReviewRequest;
use App\Http\Responses\Processes\ReviewResponses;
use Illuminate\Http\RedirectResponse;

/**
 * The owner approves a proposal of the request shown, with its proven reader when it is a check.
 */
final readonly class ApproveProposalPageController
{
    public function __invoke(ReviewRequest $form, string $proposal, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new ApproveRuleProposalCommand($proposal, $form->approval()));
    }
}
