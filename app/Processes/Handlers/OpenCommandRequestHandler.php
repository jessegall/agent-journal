<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\OpenCommandRequest;
use App\Processes\Enums\RequestState;
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

        return CommandRequest::query()->create([
            'project_key' => $projectKey,
            'actor_type' => $actor->type->value,
            'actor_id' => $actor->id,
            'operation' => $command->operation,
            'binding_digest' => $command->bindingDigest,
            'source_digest' => hash('sha256', $command->line),
            'source_excerpt' => mb_substr((string) preg_replace('/[\x00-\x1F\x7F]/', ' ', $command->line), 0, CommandRequest::EXCERPT_LENGTH),
            'hold_reason' => $command->reason,
            'state' => RequestState::CollectingDeclaration,
        ])->id;
    }
}
