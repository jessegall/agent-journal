<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Contracts\AttachmentReader;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Name('attachments_read')]
#[Description('Read private sealed upload text by id.')]
#[IsReadOnly]
final class ReadAttachmentTool extends PublicationReadTool
{
    public function __construct(private readonly AttachmentReader $attachments) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'attachment_id' => $schema->string()->max(26)->required(),
            'continuation' => $schema->string(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->attachments->attachment($arguments->ulid('attachment_id'), $arguments->continuation());
    }
}
