<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Calls\Assignments\ListAutoAssignmentsCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use App\Exceptions\InvalidActorText;
use App\Support\ActorIdentity;
use Illuminate\Console\Command;

/**
 * List an actor's auto-assignments a page at a time, over a signed call as the agent of the start.
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
