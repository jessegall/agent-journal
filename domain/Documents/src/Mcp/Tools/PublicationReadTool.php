<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp\Tools;

use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use App\Values\ReadRequest;
use Domain\Documents\Support\Mcp\Concerns\PublicationArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;

abstract class PublicationReadTool extends JournalReadTool
{
    use PublicationArguments;

    public function readRequest(ToolArguments|null $arguments = null): ReadRequest
    {
        return $arguments === null
            ? ReadRequest::forDiscovery($this->name())
            : new ReadRequest($this->name());
    }

    /**
     * @return array<string, Type>
     */
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
