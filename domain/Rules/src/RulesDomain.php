<?php

declare(strict_types=1);

namespace Domain\Rules;

use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Mcp\Contracts\ProvidesMcpTools;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Support\NumberedModel;
use App\Ui\Contracts\ProvidesNavigation;
use App\Ui\Contracts\ProvidesPages;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Enums\Icon;
use Domain\Rules\Api\Events\RuleApproved;
use Domain\Rules\Api\Events\RuleDenied;
use Domain\Rules\Api\Events\RuleRemoved;
use Domain\Rules\Api\RuleDetails;
use Domain\Rules\Api\RuleFilters;
use Domain\Rules\Api\RuleList;
use Domain\Rules\Api\RuleView;
use Domain\Rules\Commands\ApproveRule;
use Domain\Rules\Commands\DenyRule;
use Domain\Rules\Commands\ProposeRule;
use Domain\Rules\Commands\RemoveRule;
use Domain\Rules\Contracts\RuleDetailsReader;
use Domain\Rules\Contracts\RuleReader;
use Domain\Rules\Enums\RuleState;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Exceptions\RuleNotProposed;
use Domain\Rules\Http\Controllers\ApproveRuleController;
use Domain\Rules\Http\Controllers\DenyRuleController;
use Domain\Rules\Mcp\ActiveRulesOverview;
use Domain\Rules\Models\Rule;
use Domain\Rules\Readers\RulesWindowReader;

final class RulesDomain extends Domain implements ProvidesCommands, ProvidesMcpTools, ProvidesNavigation, ProvidesNumberedModels, ProvidesPages
{
    use HasNumberedModels;

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

    public function exports(): Exports
    {
        return Exports::make()
            ->events(RuleApproved::class, RuleDenied::class, RuleRemoved::class)
            ->contracts(RuleReader::class, RuleDetailsReader::class)
            ->values(
                RuleFilters::class,
                RuleDetails::class,
                RuleList::class,
                RuleView::class,
                RuleState::class,
            )
            ->commands(ApproveRule::class, DenyRule::class)
            ->exceptions(RuleMissing::class, RuleNotProposed::class)
            ->build();
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

    public function numberedModels(): array
    {
        return [NumberedModel::global(Rule::class)];
    }

    public function mcpTools(): array
    {
        return [];
    }

    public function mcpResources(): array
    {
        return [];
    }

    public function overviewContributions(): array
    {
        return [ActiveRulesOverview::class];
    }
}
