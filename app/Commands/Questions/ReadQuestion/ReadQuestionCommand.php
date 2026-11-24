<?php

declare(strict_types=1);

namespace App\Commands\Questions\ReadQuestion;

use App\Support\Command;

/**
 * Reads a question the actor in hand asked or was asked, with its answer once there is one.
 *
 * @extends Command<\App\Data\Questions\QuestionView>
 */
final readonly class ReadQuestionCommand extends Command
{
    public function __construct(public string $questionId) {}
}
