<?php

declare(strict_types=1);

namespace App\Supervision\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Records\Support\RecordIdentity;
use App\Supervision\Enums\AskAbility;
use App\Supervision\Handlers\WithdrawWorkChainHandler;
use App\Supervision\Models\Ask;
use App\Supervision\Policies\AskPolicy;

/**
 * Whoever may change the work withdraws its chain of review: its open asks close, its reservation is released and
 * its worker is stopped.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[HandledBy(WithdrawWorkChainHandler::class)]
#[Effect(CommandEffectType::AssignmentChange)]
#[Authorize(AskPolicy::class, AskAbility::Work)]
#[Operation('withdraw_work_chain', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class WithdrawWorkChain extends Command implements AuthorizedCommand
{
    public function __construct(public RecordIdentity $work) {}

    /**
     * @return class-string<Ask>
     */
    public function subject(): string
    {
        return Ask::class;
    }
}
