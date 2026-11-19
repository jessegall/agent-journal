<?php

declare(strict_types=1);

namespace App\Mcp\Data;

use Spatie\LaravelData\Data;

/**
 * One owner's part of the caller's overview: a title, its counts and the call that lists what they count.
 */
final class OverviewSection extends Data
{
    /**
     * @param  array<string, int>  $counts
     */
    public function __construct(
        public readonly string $title,
        public readonly array $counts,
        public readonly NextAction $nextAction,
    ) {}

    /**
     * @return array{title: string, counts: array<string, int>, next_action: array{tool: string, arguments: array<string, mixed>}}
     */
    public function structuredContent(): array
    {
        return [
            'title' => $this->title,
            'counts' => $this->counts,
            'next_action' => $this->nextAction->structuredContent(),
        ];
    }
}
