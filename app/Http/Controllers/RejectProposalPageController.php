<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\CommandRules\Commands\RejectRuleProposal\RejectRuleProposalCommand;
use App\Http\Requests\Processes\ReviewRequest;
use App\Http\Responses\Processes\ReviewResponses;
use Illuminate\Http\RedirectResponse;

/**
 * The owner rejects a proposal of the request shown, with the reason its author is told.
 */
final readonly class RejectProposalPageController
{
    #[Dispatches(RejectRuleProposalCommand::class)]
    public function __invoke(ReviewRequest $form, string $proposal, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new RejectRuleProposalCommand($proposal, $form->reason()));
    }
}
