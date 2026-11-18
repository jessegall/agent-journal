<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Actors\Enums\ActorType;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Handlers\ReportRequestProgressHandler;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;

/**
 * Records how a host carried out a request in one attempt: its progress, actual binding and outcome. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @implements Command<null>
 */
#[HandledBy(ReportRequestProgressHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class ReportRequestProgress implements Command
{
    public function __construct(
        public string $hostId,
        public string $requestId,
        public int $attempt,
        public RequestProgress $progress,
        public string|null $actualBinding,
        public RequestOutcome|null $outcome,
    ) {}
}
