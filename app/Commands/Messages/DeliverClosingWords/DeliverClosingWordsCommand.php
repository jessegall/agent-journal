<?php

declare(strict_types=1);

namespace App\Commands\Messages\DeliverClosingWords;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RepeatableRead;
use App\Enums\Agents\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * Delivers the closing words the session's agent was asked about, as a plain message into the inbox of the message it
 * read last; a retry returns the same message's id.
 *
 * @extends Command<string>
 */
#[Authorize(MessagePolicy::class, AccessType::Create)]
#[RepeatableRead]
final readonly class DeliverClosingWordsCommand extends Command {}
