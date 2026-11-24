<?php

declare(strict_types=1);

namespace App\Commands\Reviews\WithdrawWorkChain;

use App\Attributes\Authorize;
use App\Attributes\Effect;
use App\Attributes\RepeatableRead;
use App\Enums\AccessType;
use App\Enums\CommandEffectType;
use App\Policies\AskPolicy;
use App\Support\Command;
use App\Support\RecordIdentity;

/**
 * Whoever may change the work withdraws its chain of review: its open asks close, its reservation is released and
 * its worker is stopped.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[Effect(CommandEffectType::AssignmentChange)]
#[Authorize(AskPolicy::class, AccessType::Edit)]
final readonly class WithdrawWorkChainCommand extends Command
{
    public function __construct(public RecordIdentity $work) {}
}
