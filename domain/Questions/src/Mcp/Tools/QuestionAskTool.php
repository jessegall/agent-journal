<?php

declare(strict_types=1);

namespace Domain\Questions\Mcp\Tools;

use Domain\Questions\Commands\AskQuestion\AskQuestionCommand;
use App\Contracts\Actors\ActorTypes;
use App\Contracts\Bus\Command;
use Domain\Questions\Enums\QuestionType;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Support\ToolArguments;
use App\Support\ActorIdentity;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;
use App\Mcp\Tools\MessageWriteTool;

#[IsIdempotent]
#[VisibleToProfiles]
#[IsDestructive(false)]
#[Name('questions_ask')]
#[Dispatches(AskQuestionCommand::class)]
#[Description('Ask an actor attached to an inbox a question: open, or a choice between two or more options.')]
final class QuestionAskTool extends MessageWriteTool
{
    public function __construct(private readonly ActorTypes $actorTypes) {}

    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'inbox_id' => $this->recordIdArgument($schema),
            'target_type' => $schema->string()->enum($this->actorTypes->requestTypes())->required(),
            'target_id' => $schema->string()->required(),
            'text' => $schema->string()->required(),
            'type' => $schema->string()->enum(array_column(QuestionType::cases(), 'value'))->required(),
            'options' => $schema->array()->items($schema->string()),
        ];
    }

    protected function command(ToolArguments $arguments): Command
    {
        $targetType = $arguments->oneOf('target_type', $this->actorTypes->requestTypes());

        return new AskQuestionCommand(
            $arguments->text('inbox_id'),
            ActorIdentity::fromText("{$targetType}:{$arguments->text('target_id')}"),
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
