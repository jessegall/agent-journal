<?php

declare(strict_types=1);

namespace App\Hooks\StateLoading\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\StateLoading\StateSet;
use App\Hooks\StateLoading\Contracts\StateLoader;

/**
 * A state loader whose states depend on who the stack belongs to, such as the run that actor holds. The stack's own
 * actor is handed in; a loader without this contract reads through statesFor alone.
 */
interface RecipientStateLoader extends StateLoader
{
    public function statesForRecipient(StateReferences $references, ActorIdentity $recipient): StateSet;
}
