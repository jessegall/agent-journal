<?php

declare(strict_types=1);

namespace App\Commands\WithdrawAsk;

use App\Attributes\Authorize;
use App\Attributes\Effect;
use App\Attributes\RepeatableRead;
use App\Enums\AccessType;
use App\Enums\CommandEffectType;
use App\Policies\AskPolicy;
use App\Support\Command;
use App\Values\AskReference;

/**
 * @extends Command<AskReference>
 */
#[RepeatableRead]
#[Effect(CommandEffectType::AssignmentChange)]
#[Authorize(AskPolicy::class, AccessType::Edit)]
final readonly class WithdrawAskCommand extends Command
{
    public function __construct(public AskReference $ask) {}
}
