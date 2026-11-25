<?php

declare(strict_types=1);

namespace App\Commands\Asks\WithdrawAsk;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\Effect;
use App\Attributes\Commands\RepeatableRead;
use App\Enums\Agents\AccessType;
use App\Enums\Engine\CommandEffectType;
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
