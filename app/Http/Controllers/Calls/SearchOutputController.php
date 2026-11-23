<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\OutputMatches;
use App\Calls\Processes\SearchOutputCall;
use App\Models\Runs\ProcessRun;
use App\Support\StoredOutput;

/**
 * Answers where a text occurs in a part's stream.
 */
final readonly class SearchOutputController
{
    public function __invoke(SearchOutputCall $call, ProcessRun $processRun, StoredOutput $output): OutputMatches
    {
        $offsets = $output->search($processRun->latestAttemptAt($call->part), $call->stream, $call->text);

        return new OutputMatches('diagnostic output', $call->stream->value, $offsets);
    }
}
