<?php

declare(strict_types=1);

namespace App\Support\Keywords;

use App\Contracts\Scripts\ScriptTrigger;
use App\Values\TriggerPolicy;

final readonly class StopTrigger implements ScriptTrigger
{
    public function policy(): TriggerPolicy
    {
        return new TriggerPolicy('final-checks', 'return-policy', 'return-policy');
    }
}
