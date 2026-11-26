<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Support\TextSelection;
use Domain\Documents\Data\RecordText;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * Reads a document's text: its outline, a section, a range of lines or a search.
 *
 * @implements ApiPayload<RecordText>
 */
#[Endpoint('docs/show', 'POST', RecordText::class, ApiEffect::Read)]
final class ShowDocumentPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(32)]
        public string $number,
        public TextSelection $selection = new TextSelection(),
        #[Min(1)]
        public int|null $revision = null,
        #[MapName('at_revision'), Min(1)]
        public int|null $atRevision = null,
    ) {}
}
