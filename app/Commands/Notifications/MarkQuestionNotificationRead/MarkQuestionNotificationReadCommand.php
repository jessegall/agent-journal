<?php

declare(strict_types=1);

namespace App\Commands\Notifications\MarkQuestionNotificationRead;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * The acting actor marks read its own receipt of one question, after the page showed that exact question; it reads
 * nothing else and answers nothing.
 *
 * @extends Command<null>
 */
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class MarkQuestionNotificationReadCommand extends Command
{
    public function __construct(public string $messageId) {}
}
