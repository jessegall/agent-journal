<?php

declare(strict_types=1);

namespace App\Contracts\Scripts;

use App\Values\TriggerPolicy;

interface ScriptTrigger
{
    public function policy(): TriggerPolicy;
}
