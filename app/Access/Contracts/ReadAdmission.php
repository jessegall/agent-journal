<?php

declare(strict_types=1);

namespace App\Access\Contracts;

use App\Values\AccessDecision;
use App\Values\AllowedNames;
use App\Values\ReadRequest;

interface ReadAdmission
{
    /**
     * Whether the read may go ahead, and why not when it may not.
     */
    public function assess(ReadRequest $request): AccessDecision;

    /**
     * The targets the caller may run the named read for: every one, or only those its profile names.
     */
    public function allowedTargets(string $name): AllowedNames;
}
