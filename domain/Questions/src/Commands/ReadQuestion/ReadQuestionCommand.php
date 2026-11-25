<?php

declare(strict_types=1);

namespace Domain\Questions\Commands\ReadQuestion;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;
use Domain\Questions\Support\ShownQuestion;

/**
 * Reads a question the actor in hand asked or was asked, with its answer once there is one.
 *
 * @extends Command<ShownQuestion>
 */
#[Authorize(MessagePolicy::class, AccessType::Read)]
final readonly class ReadQuestionCommand extends Command
{
    public function __construct(public string $questionId) {}
}
