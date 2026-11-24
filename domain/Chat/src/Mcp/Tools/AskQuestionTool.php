<?php

declare(strict_types=1);

namespace Domain\Chat\Mcp\Tools;

use App\Commands\Messages\AskQuestion\AskQuestionCommand;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use App\Support\RecordIdentity;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('messages_question')]
#[Dispatches(AskQuestionCommand::class)]
#[Description('Ask the journal owner a question and return its message ID immediately.')]
final class AskQuestionTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'body' => $schema->string()->max(65536)->required(),
            'related_record' => $schema->object([
                'type' => $schema->string()->max(100)->required(),
                'id' => $this->recordIdArgument($schema),
            ])->withoutAdditionalProperties(),
        ];
    }

    protected function command(ToolArguments $arguments): AskQuestionCommand
    {
        return new AskQuestionCommand($arguments->text('body'), $this->relatedRecord($arguments));
    }

    protected function present(mixed $messageId): ToolResult
    {
        return ToolResult::ok(['message_id' => $messageId]);
    }

    private function relatedRecord(ToolArguments $arguments): RecordIdentity|null
    {
        $record = $arguments->optionalObject('related_record', ['type', 'id']);

        return $record === null ? null : new RecordIdentity($record->text('type'), $record->ulid('id'));
    }
}
