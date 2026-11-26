<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\OpenCommandRequest;

use App\Bus\Contracts\CommandHandler;
use App\Models\CommandRules\CommandRequest;
use App\Projects\SelectedProject;

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
            return $open->getKey();
        }

        return CommandRequest::create($this->projects->find(), $actor, $command)->getKey();
    }
}
