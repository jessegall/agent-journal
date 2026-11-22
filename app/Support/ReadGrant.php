<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\ReadAdmission;
use App\Contracts\ReadGrant as ReadGrantContract;
use App\Exceptions\ReadGrantRefused;
use App\Values\AllowedNames;
use App\Values\ReadRequest;

final readonly class ReadGrant implements ReadGrantContract
{
    public function __construct(private ReadAdmission $admission) {}

    public function allows(ReadRequest $request): bool
    {
        return $this->admission->assess($request)->allowed;
    }

    public function assertAllowed(ReadRequest $request): void
    {
        $decision = $this->admission->assess($request);

        if (! $decision->allowed) {
            throw ReadGrantRefused::because($decision->reason);
        }
    }

    public function allowedTargets(string $name): AllowedNames
    {
        return $this->admission->allowedTargets($name);
    }
}
