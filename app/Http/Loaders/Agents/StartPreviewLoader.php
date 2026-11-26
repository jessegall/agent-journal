<?php

declare(strict_types=1);

namespace App\Http\Loaders\Agents;

use App\Agents\Data\StartPreviewData;
use App\Agents\Data\StartPreviewInput;
use App\Models\Agents\Agent;
use App\Sessions\Contracts\ProfileSelections;
use App\Sessions\StartPreviews;
use App\Values\ProfileKey;

/**
 * Previews the start the form describes for the agent, as its start would resolve it now; the owner sees every agent,
 * so no further check runs.
 */
final readonly class StartPreviewLoader
{
    public function __construct(private ProfileSelections $selections, private StartPreviews $previews) {}

    public function __invoke(StartPreviewInput $input): StartPreviewData
    {
        $agent = Agent::query()->findOrFail(strtolower($input->agent));
        $model = $input->modelSelection();
        $profile = $this->selections->select(ProfileKey::from($agent->profile_key), $model, $input->family, null);

        return StartPreviewData::fromPreview(
            $this->previews->preview($agent, $input->family, $input->driverType, $model, $profile->defaults, null),
        );
    }
}
