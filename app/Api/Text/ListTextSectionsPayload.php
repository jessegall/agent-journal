<?php

declare(strict_types=1);

namespace App\Api\Text;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Data\Pages\TextSections;
use App\Processes\Enums\ApiEffect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * Lists the sections of one version of a record's text, a page after the section named.
 *
 * @implements ApiPayload<TextSections>
 */
#[Endpoint('text/sections', 'POST', TextSections::class, ApiEffect::Read)]
final class ListTextSectionsPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(64)]
        public string $target,
        #[Max(64)]
        public string $version,
        #[MapName('after_section'), Min(0)]
        public int $afterSection = 0,
        #[MapName('per_page'), Min(1)]
        public int|null $perPage = null,
    ) {}
}
