<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Contracts\Sessions\ProfileSelections;
use App\Data\Agents\StartPreviewData;
use App\Http\Requests\Agents\StartPreviewRequest;
use App\Models\Agents\Agent;
use App\Support\StartPreviews;
use App\Values\ProfileKey;

final readonly class StartPreviewController
{
    /**
     * Previews the start the form describes for the agent, as its start would resolve it now.
     */
    public function __invoke(
        StartPreviewRequest $request,
        string $agent,
        ProfileSelections $selections,
        StartPreviews $previews,
    ): StartPreviewData {
        $chosen = Agent::query()->findOrFail(strtolower($agent));
        $family = $request->family();
        $model = $request->model();
        $profile = $selections->select(ProfileKey::from($chosen->profile_key), $model, $family, null);

        return StartPreviewData::fromPreview(
            $previews->preview($chosen, $family, $request->driverType(), $model, $profile->defaults, null),
        );
    }
}
