<?php

declare(strict_types=1);

namespace App\Supervision\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Records\Support\RecordIdentity;
use App\Supervision\Handlers\CloseWorkChainHandler;
use App\Supervision\Policies\AskPolicy;

/**
 * The owner closes the chain of reviewed work: its open asks close, its reservation is released and its worker is
 * stopped, whatever stage it reached.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[HandledBy(CloseWorkChainHandler::class)]
#[Effect(CommandEffectType::AssignmentChange)]
#[Authorize(AskPolicy::class, AccessType::Edit)]
final readonly class CloseWorkChain extends Command
{
    public function __construct(public RecordIdentity $work) {}
}
