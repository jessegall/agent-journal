<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Assignments\AssignRecordPayload;
use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\ReadsActorText;
use App\Console\Concerns\ReadsAssignmentArguments;
use App\Console\Concerns\RunsApiPipelines;
use App\Exceptions\InvalidActorText;
use Illuminate\Console\Command;

/**
 * Give one record to a holder, over a signed call as the agent of the start.
 */
#[JournalRoute(JournalRouteType::Write)]
final class AssignRecordCommand extends Command
{
    use ReadsActorText;
    use ReadsAssignmentArguments;
    use RunsApiPipelines;

    protected $signature = 'assignment:assign {type} {id} {--to= : The new holder as type:id} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Give one record to a holder';

    public function handle(): int
    {
        try {
            $call = AssignRecordPayload::from([
                ...$this->recordFields(),
                ...$this->actorOption('to')->asFields('recipient'),
                'requestKey' => $this->requestKey(),
            ]);
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->runCall($call);
    }
}
