<?php

declare(strict_types=1);

namespace Domain\Documents\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use Domain\Documents\Data\RevisionView;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * Reads one revision of a document whole.
 *
 * @implements JournalCall<RevisionView>
 */
#[Endpoint('docs/revision', 'POST', RevisionView::class, CallEffect::Read)]
final class ShowDocumentRevisionCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(32)]
        public string $number,
        #[Min(1)]
        public int $revision,
    ) {}
}
