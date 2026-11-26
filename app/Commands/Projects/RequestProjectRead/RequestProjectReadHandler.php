<?php

declare(strict_types=1);

namespace App\Commands\Projects\RequestProjectRead;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Enums\Hosts\HostOrderType;
use App\Exceptions\HostProtocolRefused;
use App\Exceptions\ProjectReadRefused;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectRead;
use App\Support\Hosts\HostOrderPlacement;
use App\Values\HostOrderSource;
use App\Values\ProjectFileAnswer;
use App\Values\ProjectFileAnswers;
use App\Values\ProjectReadClaim;

final readonly class RequestProjectReadHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock, private HostOrderPlacement $orders) {}

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
                    ->getOrCall(fn () => $this->ordered(
                        $binding,
                        ProjectRead::create($binding, $command->type, $path, $requester),
                    )),
            ),
            array_values(array_unique($command->paths)),
        ));
    }

    /**
     * A new read goes to the binding's host as an order, which answers it on the project read's own report.
     *
     * @throws HostProtocolRefused
     */
    private function ordered(ProjectBinding $binding, ProjectRead $read): ProjectRead
    {
        $payload = ProjectReadClaim::of($read)->jsonSerialize();
        $this->orders->forHost($binding->host_id, HostOrderSource::fromJournal(), HostOrderType::ReadProject, $payload);

        return $read;
    }
}
