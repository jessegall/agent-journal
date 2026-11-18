<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\OpenCommandRequest;
use App\Processes\Models\CommandRequest;
use App\Processes\Values\ExecutionContext;

final readonly class OpenCommandRequestHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors) {}

    public function handle(OpenCommandRequest $command): string
    {
        $actor = ActorIdentity::of($this->actors->actor());
        $projectKey = ExecutionContext::inFolder($command->workingFolder)->projectKey();
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

        return CommandRequest::open(
            $projectKey,
            $actor,
            $command->operation,
            $command->bindingDigest,
            $command->line,
            $command->reason,
        )->id;
    }
}
