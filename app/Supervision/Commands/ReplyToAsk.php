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
use App\Supervision\Enums\AskAbility;
use App\Supervision\Handlers\ReplyToAskHandler;
use App\Supervision\Models\Ask;
use App\Supervision\Policies\AskPolicy;
use App\Supervision\Values\AskReference;

/**
 * @extends Command<AskReference>
 */
#[RepeatableRead]
#[HandledBy(ReplyToAskHandler::class)]
#[Effect(CommandEffectType::AssignmentChange)]
#[Authorize(AskPolicy::class, AskAbility::Work)]
#[Operation('reply_to_ask', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class ReplyToAsk extends Command implements AuthorizedCommand
{
    public function __construct(public AskReference $ask, public string $body) {}

    /**
     * @return class-string<Ask>
     */
    public function subject(): string
    {
        return Ask::class;
    }
}
