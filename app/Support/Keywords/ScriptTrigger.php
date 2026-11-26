<?php

declare(strict_types=1);

namespace App\Support\Keywords;

use App\Scripts\Contracts\ScriptTrigger as ScriptTriggerContract;
use App\Scripts\Values\TriggerPolicy;

final readonly class ScriptTrigger implements ScriptTriggerContract
{
    public function policy(): TriggerPolicy
    {
        return new TriggerPolicy('final-checks', 'return-policy', 'return-policy');
    }
}
