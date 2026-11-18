<?php

declare(strict_types=1);

namespace App\Mcp\Data;

use App\Mcp\Support\Continuation;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The signed part of a continuation cursor: who it was issued to, until when, and where the read goes on.
 */
#[MapName(SnakeCaseMapper::class)]
final class ContinuationPayload extends Data
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function __construct(
        public readonly string $agent,
        public readonly string $session,
        public readonly int $expires,
        public readonly string $tool,
        public readonly string $selector,
        public readonly array $filters,
        public readonly int $offset,
        public readonly int $characterOffset,
        public readonly int|null $revision,
        public readonly string|null $retainedPage,
    ) {}

    public function continuation(): Continuation
    {
        return new Continuation(
            $this->tool,
            $this->selector,
            $this->filters,
            $this->offset,
            $this->characterOffset,
            $this->revision,
            $this->retainedPage,
        );
    }
}
