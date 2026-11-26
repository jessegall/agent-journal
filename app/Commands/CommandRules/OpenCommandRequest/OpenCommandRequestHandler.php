<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\OpenCommandRequest;

use App\Contracts\Bus\CommandHandler;
use App\Models\CommandRules\CommandRequest;
use App\Support\Projects\SelectedProject;

final readonly class OpenCommandRequestHandler implements CommandHandler
{
    public function __construct(private SelectedProject $projects) {}

    public function handle(OpenCommandRequestCommand $command): string
    {
        $actor = $command->dispatchedBy();

        $open = CommandRequest::query()
            ->byActor($actor)
            ->forOperation($command->operation, $command->bindingDigest)
            ->stillOpen()
            ->lockForUpdate()
            ->first();

        if ($open !== null) {
            return $open->id;
        }

        return CommandRequest::create($this->projects->find(), $actor, $command)->id;
    }
}
