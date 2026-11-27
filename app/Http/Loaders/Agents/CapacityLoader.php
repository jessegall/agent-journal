<?php

declare(strict_types=1);

namespace App\Http\Loaders\Agents;

use App\Agents\Data\CapacityData;
use App\Agents\Data\CapacityInput;
use App\Hosts\CapacityCheck;
use App\Models\Agents\Agent;
use App\Sessions\Enums\StartRefusalType;
use App\Sessions\StartRemedyWords;

/**
 * Whether a start of the agent with these choices would fit the host now, or which resource it lacks, in the words of
 * the capacity refusal. It reserves nothing and starts nothing; the owner sees every agent, so no further check runs.
 */
final readonly class CapacityLoader
{
    public function __construct(private CapacityCheck $check, private StartRemedyWords $words) {}

    public function __invoke(CapacityInput $input): CapacityData
    {
        $agent = Agent::query()->findOrFail($input->agent);
        $shortage = $this->check->shortageFor($agent, $input->mode, $input->budgets());

        if ($shortage === null) {
            return CapacityData::from(['fits' => true]);
        }

        return CapacityData::from([
            'fits' => false,
            'resource' => $shortage->value,
            'explanation' => $shortage->explanation(),
            'remedy' => $this->words->textOf(StartRefusalType::CapacityUnavailable->remedy()),
        ]);
    }
}
