<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Bus\Contracts\OperationResolver;
use App\Bus\Exceptions\OperationUnavailable;
use App\Bus\Support\Operation;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\ToolResult;

/**
 * The caller's write under a request key as operations_read and its resource give it: where it stands, its refusal or
 * result, and a result's outcomes 20 at a time, each page read again for the calling session. A key this session
 * never wrote under, or whose write rolled back, reads as unknown.
 */
final readonly class OperationsResolver
{
    public const string TOOL = 'operations_read';

    public const int OUTCOMES_PER_PAGE = 20;

    private const string UNKNOWN = 'unknown';

    public function __construct(private OperationResolver $operations, private Continuations $continuations) {}

    public function read(string $requestKey, string|null $cursor): ToolResult
    {
        $offset = $cursor === null ? 0 : $this->continuations->open($cursor, self::TOOL, $requestKey)->offset;

        try {
            $operation = $this->operations->operation($requestKey);
        } catch (OperationUnavailable) {
            return ToolResult::ok(['request_key' => $requestKey, 'state' => self::UNKNOWN], []);
        }

        return $this->page($operation, $offset);
    }

    private function page(Operation $operation, int $offset): ToolResult
    {
        $result = is_array($operation->result) ? $operation->result : ['value' => $operation->result];
        $outcomes = is_array($result['outcomes'] ?? null) ? array_values($result['outcomes']) : [];
        unset($result['outcomes']);
        $next = $offset + self::OUTCOMES_PER_PAGE;

        return ToolResult::ok([
            'request_key' => $operation->requestKey,
            'command' => $operation->command,
            'state' => $operation->state->value,
            'refusal' => $operation->refusalCode === null ? null : ['code' => $operation->refusalCode->value, 'message' => $operation->refusalMessage],
            'result' => $result,
            'outcome_count' => count($outcomes),
            'outcome_offset' => $offset,
            'outcomes' => array_slice($outcomes, $offset, self::OUTCOMES_PER_PAGE),
        ], $next < count($outcomes) ? [new NextAction(self::TOOL, [
            'request_key' => $operation->requestKey,
            'continuation' => $this->continuations->issue(new Continuation(self::TOOL, $operation->requestKey, [], $next)),
        ])] : []);
    }
}
