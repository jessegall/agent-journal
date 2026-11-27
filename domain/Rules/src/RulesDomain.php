<?php

declare(strict_types=1);

namespace Domain\Rules;

use App\Access\Contracts\PolicyProvider;
use App\Access\Values\PolicyDefinition;
use App\Agents\Enums\AccessType;
use App\Bus\Contracts\CommandProvider;
use App\Concerns\HasLinkRecords;
use App\Declarations\Page;
use App\Declarations\PageActions;
use App\Mcp\Contracts\McpToolProvider;
use App\Navigation\Contracts\NavigationProvider;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Declarations\NavigationItem;
use App\Navigation\Enums\Icon;
use App\Records\Contracts\LinkRecordProvider;
use App\Skills\Contracts\SkillProvider;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\Searchable;
use Domain\Rules\Commands\ApproveRule\ApproveRuleCommand;
use Domain\Rules\Commands\DenyRule\DenyRuleCommand;
use Domain\Rules\Commands\ProposeRule\ProposeRuleCommand;
use Domain\Rules\Commands\RemoveRule\RemoveRuleCommand;
use Domain\Rules\Contracts\RuleDetailsResolver;
use Domain\Rules\Contracts\RuleResolver;
use Domain\Rules\Enums\RuleStatus;
use Domain\Rules\Events\RuleApproved;
use Domain\Rules\Events\RuleDenied;
use Domain\Rules\Events\RuleRemoved;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Exceptions\RuleNotProposed;
use Domain\Rules\Http\Controllers\ApproveRuleController;
use Domain\Rules\Http\Controllers\DenyRuleController;
use Domain\Rules\Http\Pages\Resolvers\RulesWindowResolver;
use Domain\Rules\Mcp\Resources\RulesResource;
use Domain\Rules\Mcp\Tools\ProposeRuleTool;
use Domain\Rules\Mcp\Tools\RuleReadTool;
use Domain\Rules\Mcp\Tools\RulesListTool;
use Domain\Rules\Models\Rule;
use Domain\Rules\Policies\RulePolicy;
use Domain\Rules\Support\Mcp\ActiveRulesOverview;
use Domain\Rules\Support\RuleLinkRecords;
use Domain\Rules\Support\RuleReferenceRecognizer;
use Domain\Rules\Support\RuleSearchAccess;
use Domain\Rules\Support\RuleSearchProvider;
use Domain\Rules\Support\Skills\RulesSkill;
use Domain\Rules\Values\RuleDetails;
use Domain\Rules\Values\RuleFilters;
use Domain\Rules\Values\RuleList;
use Domain\Rules\Values\RuleView;

final class RulesDomain extends Domain implements
    CommandProvider,
    LinkRecordProvider,
    McpToolProvider,
    NavigationProvider,
    PageProvider,
    PolicyProvider,
    SkillProvider
{
    use HasLinkRecords;

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
                RuleStatus::class,
            )
            ->commands(ApproveRuleCommand::class, DenyRuleCommand::class)
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
        return [
            ApproveRuleCommand::class,
            DenyRuleCommand::class,
            ProposeRuleCommand::class,
            RemoveRuleCommand::class,
        ];
    }

    public function pages(): array
    {
        return [
            Page::layout('list', 'Rules', Icon::Rules, RulesWindowResolver::class)
                ->at('')
                ->onHome(30)
                ->actions(fn (PageActions $actions) => $actions
                    ->patch('{rule}/approve', ApproveRuleController::class, 'approve')
                    ->patch('{rule}/deny', DenyRuleController::class, 'deny')),
        ];
    }

    public function mcpTools(): array
    {
        return [
            RulesListTool::class,
            RuleReadTool::class,
            ProposeRuleTool::class,
        ];
    }

    public function mcpResources(): array
    {
        return [RulesResource::class];
    }

    public function overviewContributions(): array
    {
        return [ActiveRulesOverview::class];
    }

    /**
     * Rules are found in the command palette; the sidebar draws only the design's pages.
     */
    public function navigation(): array
    {
        return [NavigationItem::page('list', 'Rules', Icon::Rules, position: 30)->offSidebar()];
    }

    public function linkRecords(): array
    {
        return [Rule::linkType() => RuleLinkRecords::class];
    }

    public function searchables(): array
    {
        return [
            Searchable::make(
                'rule',
                'Rules',
                RuleSearchAccess::class,
                RuleSearchProvider::class,
                RuleReferenceRecognizer::class,
            ),
        ];
    }

    public function skills(): array
    {
        return [RulesSkill::class];
    }
}
