<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\OpenCommandRequest;
use App\Processes\Models\CommandRequest;
use App\Processes\Support\ProjectKey;

final readonly class OpenCommandRequestHandler implements CommandHandler
{
    public function __construct(private ProjectKey $projects) {}

    public function handle(OpenCommandRequest $command): string
    {
        $actor = ActorIdentity::of($command->dispatchedBy());
        $projectKey = $this->projects->current();
        $open = CommandRequest::query()
            ->ofProject($projectKey)
            ->byActor($actor)
            ->forOperation($command->operation, $command->bindingDigest)
            ->stillOpen()
            ->lockForUpdate()
            ->first();

        if ($open !== null) {
            return $open->id;
        }

        return CommandRequest::create($projectKey, $actor, $command)->id;
    }
}
