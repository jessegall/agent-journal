<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\Drivers\Enums\ExecutablePlace;
use App\Agents\Values\PlanFile;
use App\Hosts\Enums\HostProcessType;
use App\Sessions\Enums\OfflineReplyMode;
use App\Sessions\Values\SessionContainer;

/**
 * One start of a driver as its profile plans it: the exact conversation it begins or resumes, whether it runs as a
 * terminal or as one headless turn with its prompt, the folder it works in, the model and effort asked for, the
 * command its native hooks run, the saved account it signs in with, none for a start with no account, and where its
 * driver is run from.
 */
final readonly class DriverStart
{
    /**
     * @param  list<PlanFile>  $skillFiles  the skills the session was handed, in its driver's skill folder
     */
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
        public ExecutablePlace $executablePlace = ExecutablePlace::Host,
        public OfflineReplyMode $offlineReply = OfflineReplyMode::Refuse,
        public array $skillFiles = [],
        /**
         * The container a contained session's processes run in; none on a host that runs them itself.
         */
        public SessionContainer|null $container = null,
    ) {}

    /**
     * The same start opened as the given type of process, such as the terminal a proven start opens.
     */
    public function openedAs(HostProcessType $type): self
    {
        return clone ($this, ['type' => $type]);
    }

    /**
     * The same start resuming its conversation, as a healed terminal does once its transcript exists.
     */
    public function resumed(): self
    {
        return clone ($this, ['isResume' => true]);
    }

    public function hasSkills(): bool
    {
        return $this->skillFiles !== [];
    }

    public function isTurn(): bool
    {
        return $this->type === HostProcessType::Pipe;
    }
}
