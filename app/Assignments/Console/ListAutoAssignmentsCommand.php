<?php

declare(strict_types=1);

namespace App\Assignments\Console;

use App\Actors\Exceptions\InvalidActorText;
use App\Actors\Support\ActorIdentity;
use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Assignments\Calls\ListAutoAssignmentsCall;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * List an actor's auto-assignments a page at a time, over a signed call as the agent of the launch.
 */
#[JournalRoute(JournalRouteType::Read)]
final class ListAutoAssignmentsCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'assignment:auto-list {actor : The actor as type:id}
        {--after= : The id the page starts after} {--json}';

    protected $description = 'List an actor\'s auto-assignments';

    public function handle(): int
    {
        $after = (string) $this->option('after');

        try {
            $call = ListAutoAssignmentsCall::from([
                ...ActorIdentity::fromText((string) $this->argument('actor'))->asFields('actor'),
                'after' => $after === '' ? null : $after,
            ]);
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        return $this->runCall($call);
    }
}
