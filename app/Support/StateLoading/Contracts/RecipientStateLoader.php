<?php

declare(strict_types=1);

namespace App\Support\StateLoading\Contracts;

use App\Support\ActorIdentity;
use App\Support\Decisions\StateReferences;
use App\Support\StateLoading\StateSet;

/**
 * A state loader whose states depend on who the stack belongs to, such as the run that actor holds. The stack's own
 * actor is handed in; a loader without this contract reads through statesFor alone.
 */
interface RecipientStateLoader extends StateLoader
{
    public function statesForRecipient(StateReferences $references, ActorIdentity $recipient): StateSet;
}
