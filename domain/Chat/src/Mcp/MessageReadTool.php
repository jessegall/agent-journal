<?php

declare(strict_types=1);

namespace Domain\Chat\Mcp;

use App\Communication\Enums\AgentMessageView;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name(MessageReadResult::TOOL)]
#[Description('Read a message summary or context without marking it read or selecting it.')]
final class MessageReadTool extends MessageDetailsTool
{
    public function schema(JsonSchema $schema): array
    {
        return [
            ...parent::schema($schema),
            'view' => $schema->string()->enum(array_column(AgentMessageView::cases(), 'value')),
        ];
    }
}
