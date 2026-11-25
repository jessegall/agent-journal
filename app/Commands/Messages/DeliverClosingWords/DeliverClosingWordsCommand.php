<?php

declare(strict_types=1);

namespace App\Commands\Messages\DeliverClosingWords;

use App\Attributes\Commands\RepeatableRead;
use App\Support\Command;

/**
 * Delivers the closing words the session's agent was asked about, as a plain message into the inbox of the message it
 * read last; a retry returns the same message's id.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
final readonly class DeliverClosingWordsCommand extends Command {}
