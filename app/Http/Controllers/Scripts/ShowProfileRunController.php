<?php

declare(strict_types=1);

namespace App\Http\Controllers\Scripts;

use App\Scripts\Calls\ShowProfileRunCall;
use App\Scripts\Data\ProfileRunData;
use App\Scripts\Models\ProfileRun;

/**
 * Answers one of the caller's own profile runs with its recorded steps; another actor's run is not found.
 */
final readonly class ShowProfileRunController
{
    public function __invoke(ShowProfileRunCall $call): ProfileRunData
    {
        return ProfileRunData::fromRun(ProfileRun::query()->with('results')->findOrFail(strtolower($call->id)));
    }
}
