<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Attributes\Endpoint;
use App\Attributes\InPath;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use App\Enums\OutputStream;
use Spatie\LaravelData\Attributes\FromRouteParameterProperty;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * Finds where a text occurs in a part's stream.
 *
 * @implements JournalCall<OutputMatches>
 */
#[Endpoint('processes/runs/{processRun}/output/search', 'POST', OutputMatches::class, CallEffect::Read)]
final class SearchOutputCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(500)]
        public readonly string $text,
        #[InPath, FromRouteParameterProperty('processRun', 'id')]
        public readonly string $processRun,
        #[Min(0)]
        public readonly int $part = 0,
        public readonly OutputStream $stream = OutputStream::Stdout,
    ) {}
}
