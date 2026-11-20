<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Agents\Events\SessionClosed;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use Domain\Documents\Handlers\CloseEndedDraftHandler;

/** @extends Command<void> */
#[HandledBy(CloseEndedDraftHandler::class)]
#[Effect(CommandEffectType::Recovery)]
final readonly class CloseEndedDraft extends Command
{
    public function __construct(public SessionClosed $ended) {}
}
