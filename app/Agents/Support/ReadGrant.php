<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Contracts\ReadAdmission;
use App\Agents\Contracts\ReadGrant as ReadGrantContract;
use App\Agents\Exceptions\ReadGrantRefused;
use App\Agents\Values\ReadRequest;

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
}
