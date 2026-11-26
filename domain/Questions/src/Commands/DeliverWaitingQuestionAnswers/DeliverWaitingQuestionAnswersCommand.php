<?php

declare(strict_types=1);

namespace Domain\Questions\Commands\DeliverWaitingQuestionAnswers;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Delivers to the agent's running session the notices of answers it has not had yet, oldest first, a bounded page at
 * a time; returns how many it took up.
 *
 * @extends Command<int>
 */
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class DeliverWaitingQuestionAnswersCommand extends Command
{
    public const int BATCH = 50;

    public function __construct(public string $agentId) {}
}
