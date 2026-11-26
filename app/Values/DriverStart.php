<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Hosts\HostProcessType;

/**
 * One start of a driver as its profile plans it: the exact conversation it begins or resumes, whether it runs as a
 * terminal or as one headless turn with its prompt, the folder it works in, the model and effort asked for, the
 * command its native hooks run, and the saved account it signs in with, none for a start with no account.
 */
final readonly class DriverStart
{
    public function __construct(
        public string $sessionId,
        public HostProcessType $type,
        public string $workFolder,
        public string|null $prompt = null,
        public bool $isResume = false,
        public string|null $model = null,
        public string|null $effort = null,
        public string|null $hookCommand = null,
        public DriverAccount|null $account = null,
    ) {}

    public function isTurn(): bool
    {
        return $this->type === HostProcessType::Pipe;
    }
}
