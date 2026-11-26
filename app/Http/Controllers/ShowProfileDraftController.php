<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Processes\Readers\ProfileDraftReader;
use App\Profiles\Data\ProfileDraftData;
use App\Scripts\Api\ShowProfileDraftPayload;

/**
 * Answers a profile's shared draft with what checking it finds now.
 */
final readonly class ShowProfileDraftController
{
    public function __invoke(ShowProfileDraftPayload $call, ProfileDraftReader $drafts): ProfileDraftData
    {
        return $drafts->draft($call->profileKey());
    }
}
