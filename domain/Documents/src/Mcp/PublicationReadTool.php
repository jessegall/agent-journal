<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Agents\Values\ReadRequest;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use App\Operations\Enums\ResourceAreaType;
use Domain\Documents\Mcp\Concerns\PublicationArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;

abstract class PublicationReadTool extends JournalReadTool
{
    use PublicationArguments;

    public function readRequest(ToolArguments|null $arguments = null): ReadRequest
    {
        return $arguments === null
            ? ReadRequest::forDiscovery($this->name(), ResourceAreaType::JournalContent)
            : new ReadRequest($this->name(), ResourceAreaType::JournalContent);
    }

    /** @return array<string, \Illuminate\JsonSchema\Types\Type> */
    protected function rangeSchema(JsonSchema $schema): array
    {
        return [
            'section' => $schema->string(),
            'line_start' => $schema->integer()->min(1),
            'line_end' => $schema->integer()->min(1),
            'character_offset' => $schema->integer()->min(0),
            'continuation' => $schema->string(),
        ];
    }
}
