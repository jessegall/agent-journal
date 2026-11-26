<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Support\TextSelection;
use Domain\Documents\Data\RecordText;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * Reads a report's text: its outline, a section, a range of lines or a search.
 *
 * @implements ApiPayload<RecordText>
 */
#[Endpoint('reports/show', 'POST', RecordText::class, ApiEffect::Read)]
final class ShowReportPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(32)]
        public string $number,
        public TextSelection $selection = new TextSelection(),
    ) {}
}
