<?php

declare(strict_types=1);

namespace App\Assignments\Console;

use App\Actors\Exceptions\InvalidActorText;
use App\Actors\Support\ActorIdentity;
use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * List an actor's auto-assignments a page at a time, over a signed call as the agent of the launch.
 */
#[JournalRoute(JournalRouteType::Read)]
final class ListAutoAssignmentsCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'assignment:auto-list {actor : The actor as type:id}
        {--after= : The id the page starts after} {--json}';

    protected $description = 'List an actor\'s auto-assignments';

    public function handle(AgentRequestSender $journal): int
    {
        try {
            $body = ActorIdentity::fromText((string) $this->argument('actor'))->asFields('actor');
        } catch (InvalidActorText $invalid) {
            $this->error($invalid->getMessage());

            return self::FAILURE;
        }

        $after = (string) $this->option('after');

        return $this->sendAndPrint(
            $journal,
            '/agent/assignments/auto/list',
            $after === '' ? $body : [...$body, 'after' => $after],
        );
    }
}
