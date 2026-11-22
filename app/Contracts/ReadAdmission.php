<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\AccessDecision;
use App\Values\ReadRequest;

interface ReadAdmission
{
    public function assess(ReadRequest $request): AccessDecision;
}
