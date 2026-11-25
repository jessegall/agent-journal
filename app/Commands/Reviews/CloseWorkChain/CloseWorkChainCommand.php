<?php

declare(strict_types=1);

namespace App\Commands\Reviews\CloseWorkChain;

use App\Attributes\Authorize;
use App\Attributes\Effect;
use App\Attributes\RepeatableRead;
use App\Enums\Agents\AccessType;
use App\Enums\Engine\CommandEffectType;
use App\Policies\AskPolicy;
use App\Support\Command;
use App\Support\RecordIdentity;

/**
 * The owner closes the chain of reviewed work: its open asks close, its reservation is released and its worker is
 * stopped, whatever stage it reached.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[Effect(CommandEffectType::AssignmentChange)]
#[Authorize(AskPolicy::class, AccessType::Edit)]
final readonly class CloseWorkChainCommand extends Command
{
    public function __construct(public RecordIdentity $work) {}
}
