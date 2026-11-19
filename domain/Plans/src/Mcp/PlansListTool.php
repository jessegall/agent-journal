<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp;

use App\Mcp\Contracts\NumberedPages;
use App\Mcp\Data\ToolResult;
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
#[Name('plans_list')]
#[Description('Every plan, 20 to a page, with state, progress and holder. Filter by search and states and choose the page, or send only the continuation a result gave.')]
#[IsReadOnly]
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
            fn (ToolArguments $first) => [
                'search' => $first->textOr('search', ''),
                'states' => $first->enumValues('states', PlanState::class),
                'page' => $first->positiveIntegerOr('page', 1),
            ],
            fn (array $filters) => $this->page(new PlanFilters(
                search: $filters['search'],
                page: $filters['page'],
                states: array_values(array_map(PlanState::from(...), $filters['states'])),
            )),
        );
    }

    private function page(PlanFilters $filters): ListedPage
    {
        $list = $this->plans->list($filters);
        $cards = [];

        foreach ($list->cards as $card) {
            $cards[$card->id] = PlanCardData::fromPlanCard($card)->toArray();
        }

        return new ListedPage($cards, $list->page, $list->perPage, $list->total);
    }
}
