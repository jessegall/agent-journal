<?php

declare(strict_types=1);

namespace App\Domains\Contracts;

use App\Hooks\Contracts\StateLoader;

/**
 * A domain that puts its own states on an agent's stack, such as Chat's answering-message state. Its Domain class
 * implements this beside Domain and lists every state it registers; the domain foundation registers them when Core
 * builds the state types.
 */
interface ProvidesStates
{
    /**
     * Every state type key of the domain with the factory that builds its state, such as
     * ['tasks.working' => WorkingOnTaskStateFactory::class].
     *
     * @return array<string, class-string<StateLoader>>
     */
    public function states(): array;
}
