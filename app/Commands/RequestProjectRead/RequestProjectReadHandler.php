<?php

declare(strict_types=1);

namespace App\Commands\RequestProjectRead;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Exceptions\ProjectReadRefused;
use App\Models\ProjectBinding;
use App\Models\ProjectRead;
use App\Support\ActorIdentity;
use App\Values\ProjectFileAnswer;

final readonly class RequestProjectReadHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    /**
     * @throws ProjectReadRefused
     */
    public function handle(RequestProjectReadCommand $command): ProjectFileAnswer
    {
        if (mb_strlen($command->path) > ProjectRead::PATH_CHARACTER_LIMIT) {
            throw ProjectReadRefused::pathTooLong(ProjectRead::PATH_CHARACTER_LIMIT);
        }

        $binding = ProjectBinding::lockById($command->bindingId);
        $requester = ActorIdentity::of($command->dispatchedBy());

        $read = ProjectRead::recentOf($binding, $command->type, $command->path, $requester, $this->clock->now())
            ->getOrCall(fn () => ProjectRead::create($binding, $command->type, $command->path, $requester));

        return ProjectFileAnswer::of($read);
    }
}
