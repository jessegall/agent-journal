<?php

declare(strict_types=1);

namespace App\Scripts\Http\Controllers;

use App\Scripts\Calls\ShowProfileDraftCall;
use App\Scripts\Data\ProfileDraftData;
use App\Scripts\Readers\ProfileDraftReader;

/**
 * Answers a profile's shared draft with what checking it finds now.
 */
final readonly class ShowProfileDraftController
{
    public function __invoke(ShowProfileDraftCall $call, ProfileDraftReader $drafts): ProfileDraftData
    {
        return $drafts->draft($call->profileKey());
    }
}
