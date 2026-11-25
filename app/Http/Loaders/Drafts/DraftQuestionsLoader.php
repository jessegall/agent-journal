<?php

declare(strict_types=1);

namespace App\Http\Loaders\Drafts;

use App\Data\Drafts\DraftQuestionsInput;
use App\Data\Messages\DraftQuestionsData;
use App\Support\DraftProducers;

/**
 * The questions of the draft producer registered for a noun; a noun with none is unavailable. No record is read.
 */
final readonly class DraftQuestionsLoader
{
    public function __construct(private DraftProducers $producers) {}

    public function __invoke(DraftQuestionsInput $input): DraftQuestionsData
    {
        return new DraftQuestionsData($this->producers->producerFor($input->noun)->questions());
    }
}
