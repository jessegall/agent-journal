<?php

declare(strict_types=1);

namespace Domain\Rules;

use App\Actors\Contracts\PolicyProvider;
use App\Actors\Values\PolicyDefinition;
use App\Bus\Contracts\CommandProvider;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Mcp\Contracts\McpToolProvider;
use App\Operations\Enums\AccessType;
use App\Skills\Contracts\SkillProvider;
use App\Ui\Contracts\NavigationProvider;
use App\Ui\Contracts\PageProvider;
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
use Domain\Rules\Contracts\RuleDetailsResolver;
use Domain\Rules\Contracts\RuleResolver;
use Domain\Rules\Enums\RuleState;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Exceptions\RuleNotProposed;
use Domain\Rules\Http\Controllers\ApproveRuleController;
use Domain\Rules\Http\Controllers\DenyRuleController;
use Domain\Rules\Mcp\ActiveRulesOverview;
use Domain\Rules\Mcp\ProposeRuleTool;
use Domain\Rules\Mcp\RuleReadTool;
use Domain\Rules\Mcp\RuleSearch;
use Domain\Rules\Mcp\RulesListTool;
use Domain\Rules\Mcp\RulesResource;
use Domain\Rules\Policies\RulePolicy;
use Domain\Rules\Resolvers\RulesWindowResolver;
use Domain\Rules\Skills\RulesSkill;

final class RulesDomain extends Domain implements
    CommandProvider,
    McpToolProvider,
    NavigationProvider,
    PageProvider,
    PolicyProvider,
    SkillProvider
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

    public function exports(): Exports
    {
        return Exports::make()
            ->events(RuleApproved::class, RuleDenied::class, RuleRemoved::class)
            ->contracts(RuleResolver::class, RuleDetailsResolver::class)
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

    public function policies(): array
    {
        return [
            new PolicyDefinition(
                RulePolicy::class,
                [AccessType::Read, AccessType::Create, AccessType::Edit, AccessType::Delete],
            ),
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
            Page::layout('list', 'Rules', Icon::Rules, RulesWindowResolver::class)
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
        return [NavigationItem::page('list', 'Rules', Icon::Rules, group: 'web.agents', position: 30)];
    }

    public function mcpTools(): array
    {
        return [RulesListTool::class, RuleReadTool::class, ProposeRuleTool::class];
    }

    public function mcpResources(): array
    {
        return [RulesResource::class];
    }

    public function overviewContributions(): array
    {
        return [ActiveRulesOverview::class];
    }

    public function searchContributions(): array
    {
        return [RuleSearch::class];
    }

    public function skills(): array
    {
        return [RulesSkill::class];
    }
}
