<?php

declare(strict_types=1);

namespace Domain\Documents\Calls;

use App\Attributes\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use App\Support\TextSelection;
use Domain\Documents\Data\RecordText;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * Reads a report's text: its outline, a section, a range of lines or a search.
 *
 * @implements JournalCall<RecordText>
 */
#[Endpoint('reports/show', 'POST', RecordText::class, CallEffect::Read)]
final class ShowReportCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(32)]
        public string $number,
        public TextSelection $selection = new TextSelection(),
    ) {}
}
