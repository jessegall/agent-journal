<?php

declare(strict_types=1);

namespace App\Mcp\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * What a journal tool answers: its status, the structured payload of the answer and the calls to make next.
 */
final class ToolResult extends Data
{
    /**
     * @param  array<string, mixed>  $responseFields
     * @param  list<NextAction>  $nextActions
     */
    public function __construct(
        public readonly string $status,
        #[MapName('payload')]
        public readonly array $responseFields,
        #[DataCollectionOf(NextAction::class)]
        public readonly array $nextActions,
    ) {}

    /**
     * A successful answer.
     *
     * @param  array<string, mixed>  $responseFields
     * @param  list<NextAction>  $nextActions
     */
    public static function ok(array $responseFields, array $nextActions = []): self
    {
        return self::from(['status' => 'ok', 'payload' => $responseFields, 'nextActions' => $nextActions]);
    }

    /**
     * The result as the caller reads it: status first, the payload's fields, then next_actions.
     *
     * @return array<string, mixed>
     */
    public function structuredContent(): array
    {
        return [
            'status' => $this->status,
            ...$this->responseFields,
            'next_actions' => array_map(
                fn (NextAction $action): array => $action->structuredContent(),
                $this->nextActions,
            ),
        ];
    }
}
