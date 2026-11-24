<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Attributes\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Data\Processes\ExplanationData;
use App\Enums\CallEffect;
use App\Enums\ShellDialect;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * Explains how the journal reads a shell line: its parts, and for each held part the request that holds it.
 *
 * @implements JournalCall<ExplanationData>
 */
#[Endpoint('processes/explain', 'POST', ExplanationData::class, CallEffect::Read)]
final class ExplainCommandCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(100_000)]
        public string $line,
        public ShellDialect $dialect = ShellDialect::Bash,
    ) {}
}
