<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\Support\RecordReference;
use Domain\Documents\Calls\ShowDraftCall;
use Domain\Documents\Contracts\Drafts\DraftResolver;
use Domain\Documents\Data\DraftView;

/**
 * Answers the caller's open draft.
 */
final readonly class ShowDraftController
{
    public function __invoke(ShowDraftCall $call, DraftResolver $drafts): DraftView
    {
        return $drafts->current(RecordReference::number($call->number));
    }
}
