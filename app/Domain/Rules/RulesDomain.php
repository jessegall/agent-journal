<?php

declare(strict_types=1);

namespace App\Domain\Rules;

use App\Domain\Contracts\Domain;
use App\Domain\Contracts\ProvidesNavigation;
use App\Domain\Contracts\ProvidesPages;
use App\Domain\Declarations\ActionRoute;
use App\Domain\Declarations\NavigationItem;
use App\Domain\Declarations\Page;
use App\Domain\Enums\Icon;
use App\Domain\Rules\Api\Events\RuleApproved;
use App\Domain\Rules\Api\Events\RuleDenied;
use App\Domain\Rules\Api\Events\RuleRemoved;
use App\Domain\Rules\Api\RuleFilters;
use App\Domain\Rules\Api\RuleList;
use App\Domain\Rules\Api\RuleView;
use App\Domain\Rules\Contracts\RuleReader;
use App\Domain\Rules\Contracts\RuleReviewer;
use App\Domain\Rules\Enums\RuleState;
use App\Domain\Rules\Exceptions\RuleMissing;
use App\Domain\Rules\Exceptions\RuleNotProposed;
use App\Domain\Rules\Http\Controllers\ApproveRuleController;
use App\Domain\Rules\Http\Controllers\DenyRuleController;
use App\Domain\Rules\Readers\RulesWindowReader;

final class RulesDomain implements Domain, ProvidesNavigation, ProvidesPages
{
    public function description(): string
    {
        return 'The standing project rules every agent is told.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [
            RuleApproved::class,
            RuleDenied::class,
            RuleRemoved::class,
            RuleReader::class,
            RuleReviewer::class,
            RuleFilters::class,
            RuleList::class,
            RuleView::class,
            RuleState::class,
            RuleMissing::class,
            RuleNotProposed::class,
        ];
    }

    public function pages(): array
    {
        return [
            Page::make('list', 'Rules', Icon::Rules, RulesWindowReader::class, 'RulesWindow.vue')
                ->at('')
                ->onHome(30)
                ->actions(
                    ActionRoute::patch('{rule}/approve', ApproveRuleController::class, 'approve'),
                    ActionRoute::patch('{rule}/deny', DenyRuleController::class, 'deny'),
                ),
        ];
    }

    public function navigation(): array
    {
        return [NavigationItem::page('list', 'Rules', Icon::Rules, group: 'Agents', position: 30)];
    }
}
