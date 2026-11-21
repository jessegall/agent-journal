<?php

declare(strict_types=1);

namespace App\Mcp\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

/**
 * The journal's JSON-RPC answer to a frame, passed back to the program: its id and either the method's result or an
 * error, each as the journal wrote it.
 */
final class JsonRpcReplyData extends Data
{
    /**
     * @param  array<array-key, mixed>|Optional  $result
     * @param  array<array-key, mixed>|Optional  $error
     */
    public function __construct(
        public readonly string $jsonrpc,
        public readonly int|string|null $id = null,
        public readonly array|Optional $result = new Optional(),
        public readonly array|Optional $error = new Optional(),
    ) {}
}
