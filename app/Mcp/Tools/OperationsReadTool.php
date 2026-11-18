<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Bus\Support\RequestKey;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\OperationsReader;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * operations_read: what became of your write under a request_key, with its outcomes page by page.
 */
#[Name('operations_read')]
#[Description('What became of your write sent with a request_key: completed with its result, refused with the refusal, or unknown when it never ran. Outcomes come 20 at a time; send request_key with the continuation a result gave.')]
#[IsReadOnly]
final class OperationsReadTool extends JournalReadTool
{
    protected array|null $meta = ['anthropic/alwaysLoad' => true];

    public function __construct(private readonly OperationsReader $operations) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'request_key' => $schema->string()->max(RequestKey::LONGEST)->required(),
            'continuation' => $schema->string(),
        ];
    }

    public function outputSchema(JsonSchema $schema): array
    {
        return [
            'status' => $schema->string()->required(),
            'request_key' => $schema->string()->required(),
            'state' => $schema->string()->enum(['completed', 'refused', 'taken', 'unknown'])->required(),
            'next_actions' => $schema->array()->required(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->operations->read($arguments->text('request_key'), $arguments->continuation());
    }
}
