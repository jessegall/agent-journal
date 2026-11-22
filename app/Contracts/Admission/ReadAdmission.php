<?php

declare(strict_types=1);

namespace App\Contracts\Admission;

use App\Values\AccessDecision;
use App\Values\AllowedNames;
use App\Values\ReadRequest;

interface ReadAdmission
{
    public function assess(ReadRequest $request): AccessDecision;

    /**
     * The targets the caller may run the named read for: every one, or only those its profile names.
     */
    public function allowedTargets(string $name): AllowedNames;
}
