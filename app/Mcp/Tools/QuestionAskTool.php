<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Commands\Questions\AskQuestion\AskQuestionCommand;
use App\Enums\ActorType;
use App\Enums\QuestionType;
use App\Support\ActorIdentity;
use App\Contracts\Bus\Command;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[VisibleToProfiles]
#[IsDestructive(false)]
#[Name('questions_ask')]
#[Dispatches(AskQuestionCommand::class)]
#[Description('Ask an actor attached to an inbox a question: open, or a choice between two or more options.')]
final class QuestionAskTool extends MessageWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'inbox_id' => $this->recordIdArgument($schema),
            'target_type' => $schema->string()->enum([ActorType::User->value, ActorType::Agent->value])->required(),
            'target_id' => $schema->string()->required(),
            'text' => $schema->string()->required(),
            'type' => $schema->string()->enum(array_column(QuestionType::cases(), 'value'))->required(),
            'options' => $schema->array()->items($schema->string()),
        ];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new AskQuestionCommand(
            $arguments->text('inbox_id'),
            new ActorIdentity($arguments->enum('target_type', ActorType::class), $arguments->text('target_id')),
            $arguments->text('text'),
            $arguments->enum('type', QuestionType::class),
            $arguments->optionalList('options'),
        );
    }

    protected function payload(mixed $questionId): array
    {
        return ['question_id' => $questionId];
    }
}
