<?php

declare(strict_types=1);

namespace App\Processes\Data;

use Spatie\LaravelData\Data;

/**
 * One classified part as plain data: its program family, purpose, unresolved reasons and contract tools. It is what
 * the corpus freezes and what an evidence digest hashes.
 */
final class PartSummaryData extends Data
{
    /**
     * @param  list<string>  $unresolved
     * @param  list<string>  $tools
     */
    public function __construct(
        public readonly string|null $program,
        public readonly string $purpose,
        public readonly array $unresolved,
        public readonly array $tools,
    ) {}
}
