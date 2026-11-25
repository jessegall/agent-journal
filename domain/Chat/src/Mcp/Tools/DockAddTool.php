<?php

declare(strict_types=1);

namespace Domain\Chat\Mcp\Tools;

use App\Attributes\Bus\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Chat\Commands\DockSource\DockSourceCommand;
use Domain\Chat\Data\DockAnswerData;
use Domain\Chat\Values\DockResult;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[Name('dock_add')]
#[Dispatches(DockSourceCommand::class)]
#[Description('Dock a record above your conversation, for both sides of it: give type and id, and chat (the inbox id of the chat) when you are in several chats. Answers added or present with the placement id.')]
final class DockAddTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'type' => $schema->string()->max(64)->required(),
            'id' => $schema->string()->max(255)->required(),
            'chat' => $this->optionalRecordIdArgument($schema),
        ];
    }

    protected function command(ToolArguments $arguments): DockSourceCommand
    {
        return new DockSourceCommand(
            $arguments->optionalText('chat'),
            $arguments->text('type'),
            $arguments->text('id')
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
