<?php

declare(strict_types=1);

namespace Domain\Documents\Calls;

use App\Attributes\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use Domain\Documents\Data\DraftView;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * Reads the caller's open draft of a document.
 *
 * @implements JournalCall<DraftView>
 */
#[Endpoint('docs/draft', 'POST', DraftView::class, CallEffect::Read)]
final class ShowDraftCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(32)]
        public string $number,
    ) {}
}
