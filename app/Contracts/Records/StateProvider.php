<?php

declare(strict_types=1);

namespace App\Contracts\Records;

use App\Support\States\AgentState;

/**
 * A domain that puts its own states on an agent's stack, such as Chat's answering-message state. Its Domain class
 * implements this beside Domain and lists every state it registers; the domain foundation registers them when Core
 * builds the state types.
 */
interface StateProvider
{
    /**
     * Every agent state class of the domain, such as [WorkingOnTaskState::class]; each names its own type.
     *
     * @return list<class-string<AgentState>>
     */
    public function states(): array;
}
