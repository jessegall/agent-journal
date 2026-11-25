<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Api;

use App\Support\RecordReference;
use Domain\Documents\Api\ShowDraftPayload;
use Domain\Documents\Contracts\Drafts\DraftResolver;
use Domain\Documents\Data\DraftView;

/**
 * Answers the caller's open draft.
 */
final readonly class ShowDraftController
{
    public function __invoke(ShowDraftPayload $call, DraftResolver $drafts): DraftView
    {
        return $drafts->current(RecordReference::number($call->number));
    }
}
