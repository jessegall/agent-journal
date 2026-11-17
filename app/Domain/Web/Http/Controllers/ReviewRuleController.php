<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Controllers;

use App\Domain\Rules\Contracts\RuleReviewer;
use App\Domain\Web\Data\RuleReviewInput;
use App\Domain\Web\Http\RouteId;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Approves or denies a proposed rule through Rules, then returns to the rules page with the validated filters (303).
 * An id that is no positive whole number is not found before any work; a missing rule is not found and a rule no
 * longer proposed comes back as a review error, by the renderers in WebServiceProvider.
 */
final readonly class ReviewRuleController
{
    public function __construct(
        private RuleReviewer $rules,
        private Redirector $redirect,
    ) {}

    public function approve(string $rule, RuleReviewInput $input): RedirectResponse
    {
        $this->rules->approve(RouteId::of($rule));

        return $this->backToRules($input);
    }

    public function deny(string $rule, RuleReviewInput $input): RedirectResponse
    {
        $this->rules->deny(RouteId::of($rule));

        return $this->backToRules($input);
    }

    private function backToRules(RuleReviewInput $input): RedirectResponse
    {
        return $this->redirect->route('rules.index', $input->filters->toQuery(), 303);
    }
}
