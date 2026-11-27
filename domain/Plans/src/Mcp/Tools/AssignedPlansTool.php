<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp\Tools;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Contracts\NumberedPages;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ListedPage;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use App\Support\NumberedPage;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Data\PlanCardData;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Values\AssignedPlanFilters;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * plans_assigned: one numbered page of the plans the caller holds, with Plans' own state and progress.
 */
#[IsReadOnly]
#[Name('plans_assigned')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('The plans you hold, with their state, progress and the assignment reference. Filter by search and states, page through with page and per_page (1 to 100, 20 unless given), or send only the continuation a result gave.')]
final class AssignedPlansTool extends JournalReadTool
{
    public function __construct(private readonly PlanResolver $plans, private readonly NumberedPages $pages) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'search' => $schema->string()->max(240),
            'states' => $schema->array()->items($this->caseArgument($schema, PlanStatus::class)),
            'page' => $schema->integer()->min(1),
            'per_page' => $this->wholeNumberArgument($schema, NumberedPage::LARGEST_SIZE),
            'continuation' => $schema->string(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->pages->answer(
            $this->name(),
            $arguments,
            fn (ToolArguments $initialArguments) => [
                'search' => $initialArguments->optionalText('search'),
                'states' => $initialArguments->stateValues(PlanStatus::class),
                'page' => $initialArguments->positiveIntegerOr('page', 1),
                'per_page' => $initialArguments->positiveIntegerOr('per_page', 20, NumberedPage::LARGEST_SIZE),
            ],
            fn (ToolArguments $filters) => $this->page(new AssignedPlanFilters(
                search: $filters->optionalText('search'),
                states: array_map(PlanStatus::from(...), $filters->list('states')),
                page: new NumberedPage($filters->positiveInteger('page'), $filters->positiveInteger('per_page')),
            )),
        );
    }

    private function page(AssignedPlanFilters $filters): ListedPage
    {
        $assignedPlanPage = $this->plans->assignedToCaller($filters);
        $cards = [];

        foreach ($assignedPlanPage->cards as $card) {
            $cards[$card->id] = PlanCardData::fromPlanCard($card)->toArray();
        }

        return new ListedPage(
            $cards,
            $assignedPlanPage->page->number,
            $assignedPlanPage->page->size,
            $assignedPlanPage->total,
        );
    }
}
