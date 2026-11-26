<?php

declare(strict_types=1);

namespace Domain\Helpers\Support\States;

use App\Attributes\States\StateType;
use App\Enums\Engine\FrameScope;
use App\Enums\Sessions\SessionTransferType;
use App\Support\Decisions\ContextLine;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\SessionStarted;
use App\Support\States\AgentState;
use App\Values\AgentText;
use Domain\Helpers\Events\HelperJobCancelled;
use Domain\Helpers\Events\HelperJobFinished;
use Domain\Helpers\Events\HelperJobHeld;
use Domain\Helpers\Events\HelperJobLeftUnfinished;
use Domain\Helpers\Events\HelperJobSteered;
use Domain\Helpers\Support\States\Support\HelperJobStateReference;

/**
 * The helper job a helper works on in this session: it keeps the brief, the purpose, the profile revision and the
 * records the job was given, adds each steering as it comes, tells the helper all of it whenever its context starts,
 * and ends when the job is held, left unfinished, reported or cancelled.
 */
#[StateType(HelperJobStateReference::TYPE_KEY, schemaVersion: 1, transfer: SessionTransferType::SessionOnly)]
final class HelperJobState extends AgentState
{
    /**
     * @var list<string>
     */
    private array $steering = [];

    /**
     * @var list<string>
     */
    private array $sources = [];

    private bool $hasEnded = false;

    public function __construct(
        private readonly string $jobId,
        private readonly string $helperId,
        private readonly string $profileKey,
        private readonly int $profileRevision,
        private readonly string $purpose,
        private readonly string $brief,
    ) {}

    public function frameScope(): FrameScope
    {
        return FrameScope::PerSubject;
    }

    public function isFinished(): bool
    {
        return $this->hasEnded;
    }

    // ----------[ Hooks ]----------

    /**
     * @return iterable<ContextLine>
     */
    public function onSessionStart(SessionStarted $input): iterable
    {
        yield from $this->contextLines();
    }

    /**
     * @return iterable<ContextLine>
     */
    public function onCompaction(ContextCompacted $input): iterable
    {
        yield from $this->contextLines();
    }

    // ----------[ Events ]----------

    public function onHelperJobSteered(HelperJobSteered $event): void
    {
        $this->addSteeringFor($event->jobId, $event->steering);
    }

    public function onHelperJobHeld(HelperJobHeld $event): void
    {
        $this->endFor($event->jobId);
    }

    public function onHelperJobLeftUnfinished(HelperJobLeftUnfinished $event): void
    {
        $this->endFor($event->jobId);
    }

    public function onHelperJobFinished(HelperJobFinished $event): void
    {
        $this->endFor($event->jobId);
    }

    public function onHelperJobCancelled(HelperJobCancelled $event): void
    {
        $this->endFor($event->jobId);
    }

    // ----------[ Internals ]----------

    private function addSteeringFor(string $jobId, string $steering): void
    {
        if ($jobId === $this->jobId) {
            $this->steering = [
                ...$this->steering,
                $steering,
            ];
        }
    }

    private function endFor(string $jobId): void
    {
        if ($jobId === $this->jobId) {
            $this->hasEnded = true;
        }
    }

    /**
     * What the helper must be told when its context starts: who it is, the purpose, the whole brief, the steering so
     * far and the records it was given.
     *
     * @return iterable<ContextLine>
     */
    private function contextLines(): iterable
    {
        $texts = [
            AgentText::of('helpers.identity', [
                'helper' => $this->helperId,
                'profile' => $this->profileKey,
                'revision' => $this->profileRevision,
                'job' => $this->jobId,
                'purpose' => $this->purpose,
            ]),
            AgentText::of('helpers.brief', ['brief' => $this->brief]),
            ...array_map(
                fn (string $steering) => AgentText::of('helpers.steering', ['steering' => $steering]),
                $this->steering,
            ),
            ...array_map(
                fn (string $subject) => AgentText::of('helpers.source', ['subject' => $subject]),
                $this->sources,
            ),
        ];

        foreach ($texts as $text) {
            yield new ContextLine($text);
        }
    }
}
