<?php

declare(strict_types=1);

namespace Domain\Questions\Commands\ReadQuestion;

use App\Support\Command;

/**
 * Reads a question the actor in hand asked or was asked, with its answer once there is one.
 *
 * @extends Command<\Domain\Questions\Support\ShownQuestion>
 */
final readonly class ReadQuestionCommand extends Command
{
    public function __construct(public string $questionId) {}
}
