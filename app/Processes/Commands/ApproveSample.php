<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\ApproveSampleHandler;

/**
 * A project owner approves one evidence sample of a request's exact line under its proposed declaration; the answer
 * is the one-use permit the request's actor runs it with.
 *
 * @implements Command<string>
 */
#[HandledBy(ApproveSampleHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class ApproveSample implements Command
{
    public function __construct(
        public string $commandRequestId,
        public int $expectedRevision,
        public string $commandDigest,
    ) {}
}
