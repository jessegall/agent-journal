<?php

declare(strict_types=1);

namespace App\Scripts\Enums;

use App\Agents\Values\OperationKey;

enum ScriptEffect: string
{
    case RunEvidence = 'script.run-evidence';

    public function operation(): OperationKey
    {
        return new OperationKey($this->value);
    }
}
