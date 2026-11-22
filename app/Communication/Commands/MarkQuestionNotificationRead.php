<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;

/**
 * The acting actor marks read its own receipt of one question, after the chat showed that exact question; it reads
 * nothing else and answers nothing.
 *
 * @extends Command<null>
 */
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class MarkQuestionNotificationRead extends Command
{
    public function __construct(public string $messageId) {}
}
