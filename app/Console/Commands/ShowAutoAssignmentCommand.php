<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Assignments\ShowAutoAssignmentPayload;
use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\ReadsAutoAssignmentKey;
use App\Console\Concerns\RunsApiPipelines;
use App\Exceptions\InvalidActorText;
use Illuminate\Console\Command;

/**
 * Show where an actor's auto-assignment of one type stands, over a signed call as the agent of the start.
 */
#[JournalRoute(JournalRouteType::Read)]
final class ShowAutoAssignmentCommand extends Command
{
    use ReadsAutoAssignmentKey;
    use RunsApiPipelines;

    protected $signature = 'assignment:auto-show {actor : The actor as type:id} {type : The record type} {--json}';

    protected $description = 'Show where an actor\'s auto-assignment of one record type stands';

    public function handle(): int
    {
        try {
            $call = ShowAutoAssignmentPayload::from([...$this->keyFields()]);
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->runCall($call);
    }
}
