<?php

declare(strict_types=1);

namespace Domain\Rules\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Rules\Commands\DenyRule;
use Domain\Rules\Http\Requests\ReviewRuleRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Denies a proposed rule by running the DenyRule command, then returns to the page the review came from (303). A missing rule is not
 * found and a rule no longer proposed comes back as a review error, by the renderers in RulesServiceProvider.
 */
final readonly class DenyRuleController
{
    public function __invoke(ReviewRuleRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new DenyRule($request->ruleId()));

        return $redirect->back(303);
    }
}
