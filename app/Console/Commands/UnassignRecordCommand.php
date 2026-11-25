<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Assignments\UnassignRecordCall;
use App\Console\Concerns\ReadsAssignmentArguments;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use App\Exceptions\InvalidActorText;
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
