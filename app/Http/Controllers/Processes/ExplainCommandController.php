<?php

declare(strict_types=1);

namespace App\Http\Controllers\Processes;

use App\Http\Requests\Processes\ExplainCommandRequest;
use App\Processes\Data\ExplanationData;
use App\Processes\Support\Explanations;

/**
 * Explains a shell line for the calling agent; a read that runs nothing.
 */
final readonly class ExplainCommandController
{
    public function __invoke(ExplainCommandRequest $request, Explanations $explanations): ExplanationData
    {
        return $explanations->explain($request->line(), $request->dialect());
    }
}
