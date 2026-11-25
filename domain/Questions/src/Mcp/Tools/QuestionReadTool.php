<?php

declare(strict_types=1);

namespace Domain\Questions\Mcp\Tools;

use Domain\Questions\Commands\ReadQuestion\ReadQuestionCommand;
use App\Contracts\Bus\Command;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;
use App\Mcp\Tools\MessageWriteTool;

#[IsIdempotent]
#[VisibleToProfiles]
#[IsDestructive(false)]
#[Name('questions_read')]
#[Dispatches(ReadQuestionCommand::class)]
#[Description('Read a question you asked or were asked, with its answer once it has one.')]
final class QuestionReadTool extends MessageWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return ['question_id' => $this->recordIdArgument($schema)];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new ReadQuestionCommand($arguments->text('question_id'));
    }

    protected function payload(mixed $question): array
    {
        return ['question' => $question];
    }
}
