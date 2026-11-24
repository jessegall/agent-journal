<?php

declare(strict_types=1);

namespace Domain\Chat\Mcp\Tools;

use App\Commands\Messages\RetryDelivery\RetryDeliveryCommand;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use App\Values\CallAccepted;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[Name('chat_retry_delivery')]
#[Dispatches(RetryDeliveryCommand::class)]
#[Description('Ask again for one given-up piece of chat text under its own notification key, named by its range id. Only an operator may, and one range is retried.')]
final class RetryDeliveryTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'range_id' => $this->recordIdArgument($schema),
        ];
    }

    protected function command(ToolArguments $arguments): RetryDeliveryCommand
    {
        return new RetryDeliveryCommand($arguments->ulid('range_id'));
    }

    protected function present(mixed $commandReply): ToolResult
    {
        return ToolResult::ok(new CallAccepted()->toArray());
    }
}
