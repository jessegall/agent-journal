<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

use App\Profiles\Values\OperationKey;

enum ScriptEffect: string
{
    case RunEvidence = 'script.run-evidence';

    public function operation(): OperationKey
    {
        return new OperationKey($this->value);
    }
}
