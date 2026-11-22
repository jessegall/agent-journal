<?php

declare(strict_types=1);

namespace App\Mcp\Data;

use Spatie\LaravelData\Data;

/**
 * One JSON-RPC message an MCP driver sends the relay: its id when it waits for an answer, its method when it is a
 * request or notification, and the method's own params, passed on as they came.
 */
final class JsonRpcMessageData extends Data
{
    /**
     * @param  array<array-key, mixed>  $params
     */
    public function __construct(
        public readonly string $jsonrpc,
        public readonly int|string|null $id = null,
        public readonly string|null $method = null,
        public readonly array $params = [],
    ) {}
}
