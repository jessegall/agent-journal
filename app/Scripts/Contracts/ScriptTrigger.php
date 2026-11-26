<?php

declare(strict_types=1);

namespace App\Scripts\Contracts;

use App\Scripts\Values\TriggerPolicy;

interface ScriptTrigger
{
    /**
     * When a script with this trigger runs.
     */
    public function policy(): TriggerPolicy;
}
