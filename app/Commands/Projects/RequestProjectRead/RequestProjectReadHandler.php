<?php

declare(strict_types=1);

namespace App\Commands\Projects\RequestProjectRead;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Exceptions\ProjectReadRefused;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectRead;
use App\Values\ProjectFileAnswer;
use App\Values\ProjectFileAnswers;

final readonly class RequestProjectReadHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    /**
     * @throws ProjectReadRefused
     */
    public function handle(RequestProjectReadCommand $command): ProjectFileAnswers
    {
        if (count($command->paths) > RequestProjectReadCommand::PATH_COUNT_LIMIT) {
            throw ProjectReadRefused::tooManyPaths(RequestProjectReadCommand::PATH_COUNT_LIMIT);
        }

        foreach ($command->paths as $path) {
            if (mb_strlen($path) > ProjectRead::PATH_CHARACTER_LIMIT) {
                throw ProjectReadRefused::pathTooLong(ProjectRead::PATH_CHARACTER_LIMIT);
            }
        }

        $binding = ProjectBinding::findLockedById($command->bindingId);
        $requester = $command->dispatchedBy();
        $now = $this->clock->now();

        return new ProjectFileAnswers(array_map(
            fn (string $path) => ProjectFileAnswer::of(
                ProjectRead::findRecentOf($binding, $command->type, $path, $requester, $now)
                    ->getOrCall(fn () => ProjectRead::create($binding, $command->type, $path, $requester)),
            ),
            array_values(array_unique($command->paths)),
        ));
    }
}
