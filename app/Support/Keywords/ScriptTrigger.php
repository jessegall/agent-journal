<?php

declare(strict_types=1);

namespace App\Support\Keywords;

use App\Contracts\Scripts\ScriptTrigger as ScriptTriggerContract;
use App\Values\TriggerPolicy;

final readonly class ScriptTrigger implements ScriptTriggerContract
{
    public function policy(): TriggerPolicy
    {
        return new TriggerPolicy('final-checks', 'return-policy', 'return-policy');
    }
}
