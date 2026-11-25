<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

use App\Enums\Drivers\DriverType;
use App\Support\ActorReference;
use Domain\Helpers\Values\HelperWork;

/**
 * One dispatch as the parent asked it: who asks, the request id that makes a repeat find the same job, the profile,
 * the model and driver it names, the work, and for a send the identity it addresses.
 */
final readonly class DispatchRequest
{
    public function __construct(
        public ActorReference $parent,
        public string $requestId,
        public string $profileKey,
        public string $model,
        public string|null $driverKey,
        public HelperWork $work,
        public string|null $identityId,
        public DriverType|null $driverType = null,
    ) {}

    /**
     * The fingerprint of everything the request asks, so a repeat under the same id can be told from a changed one.
     */
    public function digest(): string
    {
        return hash('sha256', json_encode([
            $this->identityId,
            $this->profileKey,
            $this->model,
            $this->driverKey,
            ...$this->work->fingerprint(),
        ], JSON_THROW_ON_ERROR));
    }
}
