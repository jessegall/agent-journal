<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Assignments\AssignRecordPayload;
use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\ReadsAssignmentArguments;
use App\Console\Concerns\RunsApiPipelines;
use App\Enums\CommandRules\JournalRouteType;
use App\Exceptions\InvalidActorText;
use App\Support\ActorReference;
use Illuminate\Console\Command;

/**
 * Give one record to a holder, over a signed call as the agent of the start.
 */
#[JournalRoute(JournalRouteType::Write)]
final class AssignRecordCommand extends Command
{
    use ReadsAssignmentArguments;
    use RunsApiPipelines;

    protected $signature = 'assignment:assign {type} {id} {--to= : The new holder as type:id} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Give one record to a holder';

    public function handle(): int
    {
        try {
            $call = AssignRecordPayload::from([
                ...$this->recordFields(),
                ...ActorReference::fromText((string) $this->option('to'))->asFields('recipient'),
                'requestKey' => $this->requestKey(),
            ]);
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->runCall($call);
    }
}
