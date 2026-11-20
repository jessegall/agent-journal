<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Values\AccessDecision;
use App\Agents\Values\ReadRequest;

interface ReadAdmission
{
    public function assess(ReadRequest $request): AccessDecision;
}
