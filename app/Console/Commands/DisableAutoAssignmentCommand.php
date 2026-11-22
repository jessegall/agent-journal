<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Assignments\DisableAutoAssignmentCall;
use App\Console\Concerns\ReadsAutoAssignmentKey;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\JournalRouteType;
use App\Exceptions\InvalidActorText;
use Illuminate\Console\Command;

/**
 * Turn an actor's auto-assignment of one type off, over a signed call as the agent of the start.
 */
#[JournalRoute(JournalRouteType::Write)]
final class DisableAutoAssignmentCommand extends Command
{
    use ReadsAutoAssignmentKey;
    use RunsCallPipelines;

    protected $signature = 'assignment:auto-disable {actor : The actor as type:id} {type : The record type}
        {--revision= : The revision read last}
        {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Turn an actor\'s auto-assignment of one record type off, keeping its pool and size';

    public function handle(): int
    {
        try {
            $call = DisableAutoAssignmentCall::from([
                ...$this->keyFields(),
                'expectedRevision' => (int) $this->option('revision'),
                'requestKey' => $this->requestKey(),
            ]);
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->runCall($call);
    }
}
