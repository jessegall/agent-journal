<?php

declare(strict_types=1);

namespace App\Domains\Contracts;

use App\Hooks\Contracts\StateType;

/**
 * A domain that puts its own states on an agent's stack, such as Chat's answering-message state. Its Domain class
 * implements this beside Domain and lists every state it registers; the domain foundation registers them when Core
 * builds the state types.
 */
interface ProvidesStates
{
    /**
     * Every state type key of the domain with the factory that builds its state, such as
     * ['chat.answering' => AnsweringMessageStateFactory::class].
     *
     * @return array<string, class-string<StateType>>
     */
    public function states(): array;
}
