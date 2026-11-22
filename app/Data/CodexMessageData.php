<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;

/**
 * One line `codex app-server` prints: an answer carries the id of the journal's request and its result, a
 * notification its method and params.
 */
final class CodexMessageData extends Data
{
    /**
     * @param  array<array-key, mixed>  $params
     * @param  array<array-key, mixed>  $result
     */
    public function __construct(
        public readonly int|string|null $id = null,
        public readonly string|null $method = null,
        public readonly array $params = [],
        public readonly array $result = [],
    ) {}

    public function answers(int $requestId): bool
    {
        return $this->id === $requestId && $this->method === null;
    }
}
