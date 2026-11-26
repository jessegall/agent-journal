<?php

declare(strict_types=1);

namespace App\Processes\Api;

use App\Attributes\Api\Endpoint;
use App\Attributes\Api\InPath;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\OutputStream;
use Spatie\LaravelData\Attributes\FromRouteParameterProperty;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * Finds where a text occurs in a part's stream.
 *
 * @implements ApiPayload<OutputMatches>
 */
#[Endpoint('processes/runs/{processRun}/output/search', 'POST', OutputMatches::class, ApiEffect::Read)]
final class SearchOutputPayload extends Data implements ApiPayload
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
