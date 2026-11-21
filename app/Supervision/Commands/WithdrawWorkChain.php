<?php

declare(strict_types=1);

namespace App\Supervision\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Records\Support\RecordIdentity;
use App\Supervision\Policies\AskPolicy;

/**
 * Whoever may change the work withdraws its chain of review: its open asks close, its reservation is released and
 * its worker is stopped.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[Effect(CommandEffectType::AssignmentChange)]
#[Authorize(AskPolicy::class, AccessType::Edit)]
final readonly class WithdrawWorkChain extends Command
{
    public function __construct(public RecordIdentity $work) {}
}
