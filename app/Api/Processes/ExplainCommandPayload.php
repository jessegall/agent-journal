<?php

declare(strict_types=1);

namespace App\Api\Processes;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Data\ExplanationData;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ShellDialect;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * Explains how the journal reads a shell line: its parts, and for each held part the request that holds it.
 *
 * @implements ApiPayload<ExplanationData>
 */
#[Endpoint('processes/explain', 'POST', ExplanationData::class, ApiEffect::Read)]
final class ExplainCommandPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(100_000)]
        public string $line,
        public ShellDialect $dialect = ShellDialect::Bash,
    ) {}
}
