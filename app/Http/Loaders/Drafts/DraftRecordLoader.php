<?php

declare(strict_types=1);

namespace App\Http\Loaders\Drafts;

use App\Data\Drafts\DraftAnswersInput;
use App\Data\Pages\DraftedRecordData;
use App\Support\DraftProducers;

/**
 * Runs the draft producer registered for a noun on the caller's own answers and returns the fields it drafted; it
 * reads no record and saves nothing.
 */
final readonly class DraftRecordLoader
{
    public function __construct(private DraftProducers $producers) {}

    public function __invoke(DraftAnswersInput $input): DraftedRecordData
    {
        return $this->producers->producerFor($input->noun)->draft($input->answers);
    }
}
