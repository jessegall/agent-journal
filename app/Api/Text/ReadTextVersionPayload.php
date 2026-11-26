<?php

declare(strict_types=1);

namespace App\Api\Text;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Data\Pages\TextVersionSummary;
use App\Processes\Enums\ApiEffect;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * Reads a record's text version: the one named, or its current one.
 *
 * @implements ApiPayload<TextVersionSummary>
 */
#[Endpoint('text/version', 'POST', TextVersionSummary::class, ApiEffect::Read)]
final class ReadTextVersionPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(64)]
        public string $target,
        #[Max(64)]
        public string|null $version = null,
    ) {}
}
