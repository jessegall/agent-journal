<?php

declare(strict_types=1);

namespace App\Http\Loaders\Agents;

use App\Data\Agents\CapacityData;
use App\Data\Agents\CapacityInput;
use App\Enums\Sessions\StartRefusalType;
use App\Models\Agents\Agent;
use App\Support\CapacityCheck;
use App\Support\StartRemedyWords;
use Spatie\LaravelData\Optional;

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
            return CapacityData::from([
                'fits' => true,
                'resource' => new Optional(),
                'explanation' => new Optional(),
                'remedy' => new Optional(),
            ]);
        }

        return CapacityData::from([
            'fits' => false,
            'resource' => $shortage->value,
            'explanation' => $shortage->explanation(),
            'remedy' => $this->words->textOf(StartRefusalType::CapacityUnavailable->remedy()),
        ]);
    }
}
