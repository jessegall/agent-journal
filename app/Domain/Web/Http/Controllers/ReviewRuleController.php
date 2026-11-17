<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Controllers;

use App\Domain\Rules\Actions\ReviewRule;
use App\Domain\Rules\Models\Rule;
use App\Domain\Web\Data\RuleReviewInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Approves or denies a proposed rule through Rules, then returns to the rules page with the validated filters (303).
 * Rules decides; a rule that is no longer proposed is shown by the RuleNotProposed renderer in WebServiceProvider.
 */
final readonly class ReviewRuleController
{
    public function __construct(
        private ReviewRule $reviewRule,
        private Redirector $redirect,
    ) {}

    public function approve(Rule $rule, RuleReviewInput $input): RedirectResponse
    {
        $this->reviewRule->approve($rule);

        return $this->backToRules($input);
    }

    public function deny(Rule $rule, RuleReviewInput $input): RedirectResponse
    {
        $this->reviewRule->deny($rule);

        return $this->backToRules($input);
    }

    private function backToRules(RuleReviewInput $input): RedirectResponse
    {
        return $this->redirect->route('rules.index', $input->filters->toQuery(), 303);
    }
}
