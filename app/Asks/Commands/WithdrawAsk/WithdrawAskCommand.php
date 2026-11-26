<?php

declare(strict_types=1);

namespace App\Asks\Commands\WithdrawAsk;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\Effect;
use App\Attributes\Commands\RepeatableRead;
use App\Engine\Enums\CommandEffectType;
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
