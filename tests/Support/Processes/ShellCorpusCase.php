<?php

declare(strict_types=1);

namespace Tests\Support\Processes;

use App\Enums\Processes\ShellDialect;
use Spatie\LaravelData\Data;

/**
 * One case of the portable shell corpus: the line, its dialect, the inputs it came from and what it is frozen to read
 * as.
 */
final class ShellCorpusCase extends Data
{
    /**
     * @param  list<array<string, mixed>>  $origins
     */
    public function __construct(
        public readonly string $id,
        public readonly string $source,
        public readonly ShellDialect $dialect,
        public readonly array $origins,
        public readonly ShellCorpusExpectation $expected,
    ) {}
}
