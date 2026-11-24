<?php

declare(strict_types=1);

namespace App\Contracts\Scripts;

use App\Values\TriggerPolicy;

interface ScriptTrigger
{
    /**
     * When a script with this trigger runs.
     */
    public function policy(): TriggerPolicy;
}
