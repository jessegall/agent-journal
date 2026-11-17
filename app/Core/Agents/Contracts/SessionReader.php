<?php

declare(strict_types=1);

namespace App\Core\Agents\Contracts;

use App\Core\Agents\Exceptions\StackTargetRefused;
use App\Core\Agents\Readers\SessionRecords;
use App\Core\Agents\Support\SessionOption;
use App\Core\Agents\Support\StackTarget;
use Illuminate\Container\Attributes\Bind;

/**
 * The running agent sessions whoever acts in this request may talk to: every one for the user, only its own for an
 * agent. It discloses the session, the agent's display name and the stack target, nothing of credentials or state.
 */
#[Bind(SessionRecords::class)]
interface SessionReader
{
    /**
     * @return list<SessionOption>
     */
    public function active(): array;

    /**
     * The stack target of a running session the actor may see; a session that is missing, ended or out of sight is
     * refused alike. The stack is checked again when it is changed.
     *
     * @throws StackTargetRefused
     */
    public function requireActive(int $sessionId): StackTarget;
}
