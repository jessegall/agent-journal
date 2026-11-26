<?php

declare(strict_types=1);

namespace App\Reads;

use App\Access\Contracts\ReadAdmission;
use App\Access\Contracts\ReadGrant as ReadGrantContract;
use App\Actors\Contracts\AgentTexts;
use App\Reads\Exceptions\ReadGrantRefused;
use App\Values\AllowedNames;
use App\Values\ReadRequest;

final readonly class ReadGrant implements ReadGrantContract
{
    public function __construct(private ReadAdmission $admission, private AgentTexts $texts) {}

    public function allows(ReadRequest $request): bool
    {
        return $this->admission->assess($request)->isAllowed;
    }

    public function assertAllowed(ReadRequest $request): void
    {
        $decision = $this->admission->assess($request);

        if (! $decision->isAllowed) {
            throw ReadGrantRefused::because($this->texts->render($decision->reason));
        }
    }

    public function allowedTargets(string $name): AllowedNames
    {
        return $this->admission->allowedTargets($name);
    }
}
