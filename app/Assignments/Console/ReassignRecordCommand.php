<?php

declare(strict_types=1);

namespace App\Assignments\Console;

use App\Actors\Exceptions\InvalidActorText;
use App\Actors\Support\ActorIdentity;
use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Assignments\Calls\ReassignRecordCall;
use App\Assignments\Console\Concerns\ReadsAssignmentArguments;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Move one record from the holder it has now to another, over a signed call as the agent of the launch.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ReassignRecordCommand extends Command
{
    use ReadsAssignmentArguments;
    use RunsCallPipelines;

    protected $signature = 'assignment:reassign {type} {id} {--assignment= : The assignment row id it has now} {--holder= : Its holder now as type:id} {--to= : The new holder as type:id} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Move one record from the holder it has now to another';

    public function handle(): int
    {
        try {
            $call = ReassignRecordCall::from([
                ...$this->recordFields(),
                ...$this->heldFields(),
                ...ActorIdentity::fromText((string) $this->option('to'))->asFields('recipient'),
                'requestKey' => $this->requestKey(),
            ]);
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->runCall($call);
    }
}
