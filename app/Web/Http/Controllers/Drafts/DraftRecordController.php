<?php

declare(strict_types=1);

namespace App\Web\Http\Controllers\Drafts;

use App\Http\Requests\Web\DraftAnswersRequest;
use App\Ui\Data\DraftedRecordData;
use App\Ui\Support\DraftProducerRegistry;

/**
 * Runs the draft producer registered for a noun on the answers given and returns the fields it drafted; it saves
 * nothing.
 */
final readonly class DraftRecordController
{
    public function __invoke(DraftAnswersRequest $request, DraftProducerRegistry $producers): DraftedRecordData
    {
        return $producers->producerFor($request->noun())->draft($request->answers());
    }
}
