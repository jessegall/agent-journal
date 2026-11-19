<?php

declare(strict_types=1);

namespace Domain\Documents\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * Lists one page of a document's revisions.
 *
 * @implements JournalCall<RevisionList>
 */
#[Endpoint('docs/revisions', 'POST', RevisionList::class, CallEffect::Read)]
final class ListDocumentRevisionsCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(32)]
        public string $number,
        #[Min(1)]
        public int $page = 1,
    ) {}
}
