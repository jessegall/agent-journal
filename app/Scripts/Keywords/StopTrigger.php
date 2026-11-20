<?php

declare(strict_types=1);

namespace App\Scripts\Keywords;

use App\Scripts\Contracts\ScriptTrigger;
use App\Scripts\Values\TriggerPolicy;

final readonly class StopTrigger implements ScriptTrigger
{
    public function policy(): TriggerPolicy
    {
        return new TriggerPolicy('final-checks', 'return-policy', 'return-policy');
    }
}
