<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Actors\Enums\ActorType;
use App\Agents\Handlers\EnrollHostHandler;
use App\Agents\Support\EnrolledHost;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;

/**
 * Enrolls a machine that may run agent programs, with the folders it may launch in; its secret is given once.
 *
 * @implements Command<EnrolledHost>
 */
#[HandledBy(EnrollHostHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class EnrollHost implements Command
{
    /**
     * @param  list<string>  $launchRoots
     */
    public function __construct(
        public string $installationName,
        public array $launchRoots,
    ) {}
}
