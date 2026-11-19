<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Processes\Calls\OutputMatches;
use App\Processes\Calls\SearchOutputCall;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\StoredOutput;

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
