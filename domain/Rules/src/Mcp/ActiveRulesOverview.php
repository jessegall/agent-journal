<?php

declare(strict_types=1);

namespace Domain\Rules\Mcp;

use App\Mcp\Contracts\OverviewContribution;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\OverviewSection;
use Domain\Rules\Contracts\RuleDetailsResolver;

/**
 * The rules section of the caller's overview: how many rules hold, and the call that lists them.
 */
final readonly class ActiveRulesOverview implements OverviewContribution
{
    public function __construct(private RuleDetailsResolver $rules) {}

    public function section(): string
    {
        return 'rules';
    }

    public function read(): OverviewSection
    {
        return OverviewSection::from([
            'title' => 'Rules that hold',
            'counts' => ['active' => $this->rules->activeCount()],
            'nextAction' => new NextAction('rules_list', ['state' => 'active']),
        ]);
    }
}
