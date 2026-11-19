<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Actors\Enums\ActorType;
use App\Assignments\Contracts\AssigneeResolver;
use App\Assignments\Support\AssigneeName;
use App\Assignments\Support\Page;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\Continuations;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * assignees_list: the actors of one type work may be given to, in id order, after an id and at most 100 at a time.
 */
#[Name('assignees_list')]
#[Description('The agents or users work may be given to, in id order: give type, and after_id and limit (1 to 100, 20 unless given), or type and the continuation a result gave. There is no page number.')]
#[IsReadOnly]
final class AssigneesListTool extends JournalReadTool
{
    private const int DEFAULT_LIMIT = 20;

    public function __construct(
        private readonly AssigneeResolver $assignees,
        private readonly Continuations $continuations,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'type' => $schema->string()->enum(
                array_map(fn (ActorType $type): string => $type->value, ActorType::requestTypes()),
            )->required(),
            'after_id' => $schema->string()->max(26),
            'limit' => $schema->integer()->min(1)->max(Page::LARGEST_LIMIT),
            'continuation' => $schema->string(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        $type = $arguments->enum('type', ActorType::class);
        $cursor = $arguments->continuation();
        $filters = $cursor === null
            ? ['after_id' => $arguments->optionalText('after_id'), 'limit' => $arguments->positiveIntegerOr('limit', self::DEFAULT_LIMIT, Page::LARGEST_LIMIT)]
            : $this->continuations->open($cursor, $this->name(), $type->value)->filters;
        $list = $this->assignees->eligible($type->value, new Page($filters['after_id'], $filters['limit']));
        $nextActions = $list->nextAfterId === null ? [] : [new NextAction($this->name(), [
            'type' => $type->value,
            'continuation' => $this->continuations->issue(
                new Continuation(
                    $this->name(),
                    $type->value,
                    ['after_id' => $list->nextAfterId, 'limit' => $filters['limit']],
                    0,
                ),
            ),
        ])];

        return ToolResult::ok([
            'type' => $type->value,
            'assignees' => array_map(fn (AssigneeName $assignee) => $assignee->listing(), $list->assignees),
        ], $nextActions);
    }
}
