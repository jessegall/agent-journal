<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\VerifyRestoredOutputHandler;

/**
 * After an operator restored files to the output disk, a user checks a run's parts against their original chunk
 * checksums; only parts whose every byte matches become complete again.
 *
 * @implements Command<array<string, string>>
 */
#[HandledBy(VerifyRestoredOutputHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class VerifyRestoredOutput implements Command
{
    public function __construct(public string $runId) {}
}
