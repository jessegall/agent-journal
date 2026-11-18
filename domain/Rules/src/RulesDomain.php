<?php

declare(strict_types=1);

namespace Domain\Rules;

use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Bootstrappers\LoadMigrations;
use App\Domains\Contracts\Domain;
use App\Domains\Contracts\ProvidesBootstrappers;
use App\Ui\Contracts\ProvidesNavigation;
use App\Ui\Contracts\ProvidesPages;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Enums\Icon;
use Domain\Rules\Api\Events\RuleApproved;
use Domain\Rules\Api\Events\RuleDenied;
use Domain\Rules\Api\Events\RuleRemoved;
use Domain\Rules\Api\RuleFilters;
use Domain\Rules\Api\RuleList;
use Domain\Rules\Api\RuleView;
use Domain\Rules\Commands\ApproveRule;
use Domain\Rules\Commands\DenyRule;
use Domain\Rules\Commands\ProposeRule;
use Domain\Rules\Commands\RemoveRule;
use Domain\Rules\Contracts\RuleReader;
use Domain\Rules\Enums\RuleState;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Exceptions\RuleNotProposed;
use Domain\Rules\Http\Controllers\ApproveRuleController;
use Domain\Rules\Http\Controllers\DenyRuleController;
use Domain\Rules\Readers\RulesWindowReader;

final class RulesDomain implements Domain, ProvidesBootstrappers, ProvidesCommands, ProvidesNavigation, ProvidesPages
{
    public function description(): string
    {
        return 'The standing project rules every agent is told.';
    }

    public function bootstrappers(): array
    {
        return [LoadMigrations::class];
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
            ApproveRule::class,
            DenyRule::class,
            RuleFilters::class,
            RuleList::class,
            RuleView::class,
            RuleState::class,
            RuleMissing::class,
            RuleNotProposed::class,
        ];
    }

    /**
     * @return list<class-string>
     */
    public function commands(): array
    {
        return [ApproveRule::class, DenyRule::class, ProposeRule::class, RemoveRule::class];
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
