<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Assignments\ReassignRecordPayload;
use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\ReadsAssignmentArguments;
use App\Console\Concerns\RunsApiPipelines;
use App\Exceptions\InvalidActorText;
use App\Support\ActorReference;
use Illuminate\Console\Command;

/**
 * Move one record from the holder it has now to another, over a signed call as the agent of the start.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ReassignRecordCommand extends Command
{
    use ReadsAssignmentArguments;
    use RunsApiPipelines;

    protected $signature = 'assignment:reassign {type} {id} {--assignment= : The assignment row id it has now} {--holder= : Its holder now as type:id} {--to= : The new holder as type:id} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Move one record from the holder it has now to another';

    public function handle(): int
    {
        try {
            $call = ReassignRecordPayload::from([
                ...$this->recordFields(),
                ...$this->heldFields(),
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
