<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\CommandRules\Commands\RestoreCommandRule\RestoreCommandRuleCommand;
use App\Http\Requests\Processes\ReviewRequest;
use App\Http\Responses\Processes\ReviewResponses;
use Illuminate\Http\RedirectResponse;

/**
 * The owner restores an earlier approved revision of the rule the request shown uses, as a new proposal.
 */
final readonly class RestoreRulePageController
{
    #[Dispatches(RestoreCommandRuleCommand::class)]
    public function __invoke(ReviewRequest $form, string $rule, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new RestoreCommandRuleCommand(
            $rule,
            $form->fromRevision(),
            $form->expectedRevision(),
            $form->requestKey(),
        ));
    }
}
