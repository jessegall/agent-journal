<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Processes\Api\OutputMatches;
use App\Processes\Api\SearchOutputPayload;
use App\Processes\StoredOutput;

/**
 * Answers where a text occurs in a part's stream.
 */
final readonly class SearchOutputController
{
    public function __invoke(SearchOutputPayload $call, ProcessRun $processRun, StoredOutput $output): OutputMatches
    {
        $attempt = PartRun::findLatestAttemptAt($processRun, $call->part);
        $offsets = $output->search($attempt, $call->stream, $call->text);

        return new OutputMatches('diagnostic output', $call->stream->value, $offsets);
    }
}
