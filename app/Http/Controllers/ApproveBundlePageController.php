<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\CommandRules\ApproveRuleBundle\ApproveRuleBundleCommand;
use App\Http\Requests\Processes\ApproveBundleRequest;
use App\Http\Responses\Processes\ReviewResponses;
use Illuminate\Http\RedirectResponse;

/**
 * The owner activates a module's rule bundle at the digest shown on the review list.
 */
final readonly class ApproveBundlePageController
{
    public function __invoke(ApproveBundleRequest $form, ReviewResponses $review): RedirectResponse
    {
        return $review->run(new ApproveRuleBundleCommand($form->module(), $form->moduleVersion(), $form->digest()));
    }
}
