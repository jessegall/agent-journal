<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Calls\Assignments\AssignRecordCall;
use App\Console\Concerns\ReadsAssignmentArguments;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use App\Exceptions\InvalidActorText;
use App\Support\ActorIdentity;
use Illuminate\Console\Command;

/**
 * Give one record to a holder, over a signed call as the agent of the start.
 */
#[JournalRoute(JournalRouteType::Write)]
final class AssignRecordCommand extends Command
{
    use ReadsAssignmentArguments;
    use RunsCallPipelines;

    protected $signature = 'assignment:assign {type} {id} {--to= : The new holder as type:id} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Give one record to a holder';

    public function handle(): int
    {
        try {
            $call = AssignRecordCall::from([
                ...$this->recordFields(),
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
