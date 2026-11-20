<?php

declare(strict_types=1);

namespace App\Scripts\Contracts;

use App\Scripts\Values\TriggerPolicy;

interface ScriptTrigger
{
    public function policy(): TriggerPolicy;
}
