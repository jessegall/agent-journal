<?php

declare(strict_types=1);

namespace App\Http\Controllers\Drafts;

use App\Data\Pages\DraftedRecordData;
use App\Http\Requests\Web\DraftAnswersRequest;
use App\Support\DraftProducers;

/**
 * Runs the draft producer registered for a noun on the answers given and returns the fields it drafted; it saves
 * nothing.
 */
final readonly class DraftRecordController
{
    public function __invoke(DraftAnswersRequest $request, DraftProducers $producers): DraftedRecordData
    {
        return $producers->producerFor($request->noun())->draft($request->answers());
    }
}
