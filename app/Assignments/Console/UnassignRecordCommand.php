<?php

declare(strict_types=1);

namespace App\Assignments\Console;

use App\Actors\Exceptions\InvalidActorText;
use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Assignments\Calls\UnassignRecordCall;
use App\Assignments\Console\Concerns\ReadsAssignmentArguments;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Release one record from the holder it has now, over a signed call as the agent of the start.
 */
#[JournalRoute(JournalRouteType::Write)]
final class UnassignRecordCommand extends Command
{
    use ReadsAssignmentArguments;
    use RunsCallPipelines;

    protected $signature = 'assignment:unassign {type} {id} {--assignment= : The assignment row id it has now} {--holder= : Its holder now as type:id} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Release one record from the holder it has now';

    public function handle(): int
    {
        try {
            $call = UnassignRecordCall::from([
                ...$this->recordFields(),
                ...$this->heldFields(),
                'requestKey' => $this->requestKey(),
            ]);
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->runCall($call);
    }
}
