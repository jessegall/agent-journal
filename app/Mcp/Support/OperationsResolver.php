<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Contracts\Authorization\OperationResolver;
use App\Exceptions\OperationUnavailable;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\ToolResult;
use App\Support\Operation;

/**
 * The caller's write under a request key as operations_read and its resource give it: where it stands, its refusal or
 * result, and up to 20 outcomes per page, each page read again for the calling session. A key this session
 * never wrote under, or whose write rolled back, reads as unknown.
 */
final readonly class OperationsResolver
{
    public const string TOOL = 'operations_read';

    public const int OUTCOMES_PER_PAGE = 20;

    private const string UNKNOWN = 'unknown';

    public function __construct(
        private OperationResolver $operations,
        private Continuations $continuations,
        private ResultBudget $budget,
    ) {}

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
        $receiptFields = is_array($operation->commandReply)
            ? $operation->commandReply
            : ['value' => $operation->commandReply];

        $outcomes = is_array($receiptFields['outcomes'] ?? null) ? array_values($receiptFields['outcomes']) : [];
        unset($receiptFields['outcomes']);

        $pageFields = [
            'request_key' => $operation->requestKey,
            'command' => $operation->command,
            'state' => $operation->state->value,
            'refusal' => $operation->refusalCode === null ? null : [
                'code' => $operation->refusalCode->value,
                'message' => $operation->refusalMessage,
            ],
            'result' => $receiptFields,
            'outcome_count' => count($outcomes),
            'outcome_offset' => $offset,
            'outcomes' => [],
        ];

        foreach (array_slice($outcomes, $offset, self::OUTCOMES_PER_PAGE) as $outcome) {
            $page = [...$pageFields['outcomes'], $outcome];

            if ($pageFields['outcomes'] !== [] && ! $this->budget->payloadFits([...$pageFields, 'outcomes' => $page])) {
                break;
            }

            $pageFields['outcomes'] = $page;
        }

        $next = $offset + count($pageFields['outcomes']);

        return ToolResult::ok($pageFields, $next < count($outcomes) ? [new NextAction(self::TOOL, [
            'request_key' => $operation->requestKey,
            'continuation' => $this->continuations->issue(
                new Continuation(self::TOOL, $operation->requestKey, [], $next),
            ),
        ])] : []);
    }
}
