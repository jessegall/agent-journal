<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Actors\Contracts\ActorTypes;
use App\Assignments\Contracts\AssigneeResolver;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\Continuations;
use App\Mcp\Support\ToolArguments;
use App\Support\AssigneeName;
use App\Support\IdListPage;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * assignees_list: the actors of one type work may be given to, in id order, after an id and at most 100 at a time.
 */
#[IsReadOnly]
#[Name('assignees_list')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('The agents or users work may be given to, in id order: give type, and after_id and limit (1 to 100, 20 unless given), or type and the continuation a result gave. There is no page number.')]
final class AssigneesListTool extends JournalReadTool
{
    private const int DEFAULT_LIMIT = 20;

    public function __construct(
        private readonly AssigneeResolver $assignees,
        private readonly Continuations $continuations,
        private readonly ActorTypes $actorTypes,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'type' => $schema->string()->enum(
                $this->actorTypes->requestTypes(),
            )->required(),
            'after_id' => $this->optionalRecordIdArgument($schema),
            'limit' => $this->wholeNumberArgument($schema, 1, IdListPage::LARGEST_LIMIT),
            'continuation' => $schema->string(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        $type = $arguments->oneOf('type', $this->actorTypes->requestTypes());
        $cursor = $arguments->continuation();

        $filters = $cursor === null
            ? [
                'after_id' => $arguments->optionalText('after_id'),
                'limit' => $arguments->positiveIntegerOr('limit', self::DEFAULT_LIMIT, IdListPage::LARGEST_LIMIT),
            ]
            : $this->continuations->open($cursor, $this->name(), $type)->filters;

        $assigneePage = $this->assignees->eligible(
            $type,
            new IdListPage($filters['after_id'], $filters['limit']),
        );

        $nextActions = $assigneePage->nextAfterId === null ? [] : [new NextAction($this->name(), [
            'type' => $type,
            'continuation' => $this->continuations->issue(
                new Continuation(
                    $this->name(),
                    $type,
                    ['after_id' => $assigneePage->nextAfterId, 'limit' => $filters['limit']],
                    0,
                ),
            ),
        ])];

        return ToolResult::ok([
            'type' => $type,
            'assignees' => array_map(fn (AssigneeName $assignee) => $assignee->listing(), $assigneePage->assignees),
        ], $nextActions);
    }
}
