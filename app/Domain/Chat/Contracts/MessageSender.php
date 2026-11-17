<?php

declare(strict_types=1);

namespace App\Domain\Chat\Contracts;

use App\Core\Agents\Exceptions\StackTargetRefused;
use App\Core\Agents\Support\StackTarget;
use App\Domain\Chat\Actions\SendMessage;
use App\Domain\Chat\Exceptions\MessageBodyEmpty;
use Illuminate\Container\Attributes\Bind;

/**
 * Sends the user's message to a running agent session, its body kept exactly as written, and asks the session to
 * answer it; the message and the stack change commit together.
 */
#[Bind(SendMessage::class)]
interface MessageSender
{
    /**
     * @throws MessageBodyEmpty when the body holds nothing but spaces
     * @throws StackTargetRefused when the session's stack may not take it
     */
    public function send(string $body, StackTarget $target): void;
}
