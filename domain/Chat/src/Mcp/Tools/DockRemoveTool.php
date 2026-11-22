<?php

declare(strict_types=1);

namespace Domain\Chat\Mcp\Tools;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Chat\Commands\UndockSource\UndockSourceCommand;
use Domain\Chat\Data\DockAnswerData;
use Domain\Chat\Values\DockResult;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(true)]
#[Name('dock_remove')]
#[Dispatches(UndockSourceCommand::class)]
#[Description('Undock a placement from your conversation, named with the type and source id dock_list gave it; the record itself stays. Answers removed, or unavailable when nothing was there.')]
final class DockRemoveTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'placement_id' => $schema->string()->max(26)->required(),
            'type' => $schema->string()->max(64)->required(),
            'source_id' => $schema->string()->max(255)->required(),
            'chat' => $schema->string()->max(26),
        ];
    }

    protected function command(ToolArguments $arguments): UndockSourceCommand
    {
        return new UndockSourceCommand(
            $arguments->optionalText('chat'),
            $arguments->ulid('placement_id'),
            $arguments->text('type'),
            $arguments->text('source_id'),
        );
    }

    /**
     * @param  DockResult  $commandReply
     */
    protected function present(mixed $commandReply): ToolResult
    {
        return ToolResult::ok(DockAnswerData::fromDockResult($commandReply)->toArray());
    }
}
