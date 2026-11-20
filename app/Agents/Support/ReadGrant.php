<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Contracts\ReadAdmission;
use App\Agents\Exceptions\ReadGrantRefused;
use App\Agents\Values\ReadRequest;

final readonly class ReadGrant
{
    public function __construct(private ReadAdmission $admission) {}

    public function allows(ReadRequest $request): bool
    {
        return $request->isRecovery() || $this->admission->assess($request)->allowed;
    }

    public function assertAllowed(ReadRequest $request): void
    {
        if ($request->isRecovery()) {
            return;
        }

        $decision = $this->admission->assess($request);

        if (! $decision->allowed) {
            throw ReadGrantRefused::because($decision->reason);
        }
    }
}
