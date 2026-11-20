<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Contracts\NumberedPages;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ListedPage;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Data\PlanCardData;
use Domain\Plans\Enums\PlanState;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * plans_list: one page of every plan, 20 to a page as Plans keeps it, with state and progress.
 */
#[IsReadOnly]
#[Name('plans_list')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('Every plan, 20 to a page, with state, progress and holder. Filter by search and states and choose the page, or send only the continuation a result gave.')]
final class PlansListTool extends JournalReadTool
{
    public function __construct(private readonly PlanResolver $plans, private readonly NumberedPages $pages) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'search' => $schema->string()->max(240),
            'states' => $schema->array()->items($schema->string()->enum(array_column(PlanState::cases(), 'value'))),
            'page' => $schema->integer()->min(1),
            'continuation' => $schema->string(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->pages->answer(
            $this->name(),
            $arguments,
            fn (ToolArguments $initialArguments) => [
                'search' => $initialArguments->textOr('search', ''),
                'states' => $initialArguments->enumValues('states', PlanState::class),
                'page' => $initialArguments->positiveIntegerOr('page', 1),
            ],
            fn (ToolArguments $filters) => $this->page(new PlanFilters(
                search: $filters->text('search'),
                page: $filters->positiveInteger('page'),
                states: array_map(PlanState::from(...), $filters->list('states')),
            )),
        );
    }

    private function page(PlanFilters $filters): ListedPage
    {
        $planPage = $this->plans->list($filters);
        $cards = [];

        foreach ($planPage->cards as $card) {
            $cards[$card->id] = PlanCardData::fromPlanCard($card)->toArray();
        }

        return new ListedPage($cards, $planPage->page, $planPage->perPage, $planPage->total);
    }
}
