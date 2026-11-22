<?php

declare(strict_types=1);

namespace App\Communication\Mcp;

use App\Bus\Contracts\Command;
use App\Communication\Commands\AcknowledgePresentation;
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
#[Name('messages_acknowledge_presented')]
#[Dispatches(AcknowledgePresentation::class)]
#[Description('Confirm the pieces of chat text your driver showed, by batch id and the handles of its pieces; a chat message is read only once its whole body was confirmed in this driver context.')]
final class MessagePresentationAcknowledgeTool extends MessageWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'batch_id' => $schema->string()->max(26)->required(),
            'handles' => $schema->array()->items($schema->string()->max(64))->required(),
            'context_key' => $schema->string()->max(255)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new AcknowledgePresentation(
            $arguments->text('batch_id'),
            $arguments->list('handles'),
            $arguments->text('context_key'),
        );
    }

    protected function payload(mixed $confirmed): array
    {
        return ['confirmed' => $confirmed];
    }
}
