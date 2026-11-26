<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\CommandRules\Commands\RetireCommandRule\RetireCommandRuleCommand;
use App\Http\Requests\Processes\ReviewRequest;
use App\Http\Responses\Processes\ReviewResponses;
use Illuminate\Http\RedirectResponse;

/**
 * The owner retires the rule the request shown uses, at the revision they read, with their reason.
 */
final readonly class RetireRulePageController
{
    #[Dispatches(RetireCommandRuleCommand::class)]
    public function __invoke(ReviewRequest $form, string $rule, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new RetireCommandRuleCommand($rule, $form->expectedRevision(), $form->reason()));
    }
}
