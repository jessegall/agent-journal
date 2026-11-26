<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Profiles\ProfileRun;
use App\Profiles\Data\ProfileRunData;
use App\Scripts\Api\ShowProfileRunPayload;

/**
 * Answers one of the caller's own profile runs with its recorded steps; another actor's run is not found.
 */
final readonly class ShowProfileRunController
{
    public function __invoke(ShowProfileRunPayload $call): ProfileRunData
    {
        $profileRun = ProfileRun::query()->withResults()->findOrFail(strtolower($call->id));

        return ProfileRunData::fromRun($profileRun);
    }
}
