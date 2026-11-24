<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\OpenCommandRequest;

use App\Contracts\Bus\CommandHandler;
use App\Models\CommandRules\CommandRequest;
use App\Support\ActorIdentity;
use App\Support\ProjectKey;

final readonly class OpenCommandRequestHandler implements CommandHandler
{
    public function __construct(private ProjectKey $projects) {}

    public function handle(OpenCommandRequestCommand $command): string
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
