<?php

declare(strict_types=1);

namespace App\Web\Http\Controllers\Drafts;

use App\Http\Requests\Web\DraftQuestionsRequest;
use App\Ui\Data\DraftQuestionsData;
use App\Ui\Support\DraftProducerRegistry;

/**
 * The questions of the draft producer registered for a noun; a noun with none is not found.
 */
final readonly class DraftQuestionsController
{
    public function __invoke(DraftQuestionsRequest $request, DraftProducerRegistry $producers): DraftQuestionsData
    {
        return new DraftQuestionsData($producers->producerFor($request->noun())->questions());
    }
}
