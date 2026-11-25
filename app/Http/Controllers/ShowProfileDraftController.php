<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Api\Scripts\ShowProfileDraftPayload;
use App\Data\Profiles\ProfileDraftData;
use App\Support\Readers\ProfileDraftReader;

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
