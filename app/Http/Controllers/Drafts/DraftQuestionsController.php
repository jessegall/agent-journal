<?php

declare(strict_types=1);

namespace App\Http\Controllers\Drafts;

use App\Data\Messages\DraftQuestionsData;
use App\Http\Requests\Web\DraftQuestionsRequest;
use App\Support\DraftProducers;

/**
 * The questions of the draft producer registered for a noun; a noun with none is not found.
 */
final readonly class DraftQuestionsController
{
    public function __invoke(DraftQuestionsRequest $request, DraftProducers $producers): DraftQuestionsData
    {
        return new DraftQuestionsData($producers->producerFor($request->noun())->questions());
    }
}
