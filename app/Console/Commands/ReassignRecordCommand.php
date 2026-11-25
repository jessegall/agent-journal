<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Assignments\ReassignRecordCall;
use App\Console\Concerns\ReadsAssignmentArguments;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use App\Exceptions\InvalidActorText;
use App\Support\ActorIdentity;
use Illuminate\Console\Command;

/**
 * Move one record from the holder it has now to another, over a signed call as the agent of the start.
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
