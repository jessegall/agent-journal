<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Hooks\Commands\FocusPlan;
use App\Hooks\Commands\FocusTask;
use App\Hooks\Commands\RefreshPlanInstruction;
use App\Hooks\Commands\ReleasePlanFocus;
use App\Hooks\Commands\ReleaseTaskFocus;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\LifecycleStage;
use App\Hooks\Exceptions\InstructionOriginRefused;
use App\Hooks\Lifecycle\LifecycleOrigin;
use App\Hooks\Lifecycle\LifecycleOrigins;
use App\Hooks\Values\InstructionMarker;

/**
 * The one declared place that says which reserved instruction command a frame may ask for, from which callback of
 * which state type; the command reads its target, frame and subject from the engine's origin alone.
 */
final readonly class ReservedInstructions
{
    /**
     * Each reserved command with the state type it serves and the stages it may come from.
     */
    public const array ALLOWED = [
        FocusTask::class => ['tasks.working', [LifecycleStage::Enter, LifecycleStage::Resume]],
        ReleaseTaskFocus::class => ['tasks.working', [LifecycleStage::Exit]],
        FocusPlan::class => ['plans.working', [LifecycleStage::Enter, LifecycleStage::Resume]],
        ReleasePlanFocus::class => ['plans.working', [LifecycleStage::Exit]],
        RefreshPlanInstruction::class => ['plans.working', [LifecycleStage::Enter, LifecycleStage::Resume]],
    ];

    public function __construct(private LifecycleOrigins $origins, private InstructionMarkers $markers) {}

    /**
     * Replaces the marker of the frame the command came from.
     *
     * @param  class-string  $command
     */
    public function focus(string $command, string $instructionType): void
    {
        $origin = $this->originFor($command);
        $subject = self::subjectOf($origin, $command);

        $this->markers->replace(
            $origin->target,
            $origin->frameId,
            new InstructionMarker($instructionType, $subject->id, $subject->runNumber),
        );
    }

    /**
     * Refreshes the plan frame's marker only when the plan the fact names is the frame's own plan.
     *
     * @param  class-string  $command
     */
    public function refresh(string $command, string $instructionType, string $planId): void
    {
        $origin = $this->originFor($command);
        $subject = self::subjectOf($origin, $command);

        if ($subject->id !== $planId) {
            throw InstructionOriginRefused::otherSubject($command, $origin->description());
        }

        $this->markers->replace($origin->target, $origin->frameId, new InstructionMarker($instructionType, $planId, 0));
    }

    /**
     * Forgets the marker of the frame the command came from, and no other.
     *
     * @param  class-string  $command
     */
    public function release(string $command): void
    {
        $origin = $this->originFor($command);
        $this->markers->forget($origin->target, $origin->frameId);
    }

    /**
     * @param  class-string  $command
     */
    private function originFor(string $command): LifecycleOrigin
    {
        $origin = $this->origins->current()->getOrThrow(InstructionOriginRefused::missing($command));
        [$typeKey, $stages] = self::ALLOWED[$command];

        if ($origin->reference->typeKey !== $typeKey || ! in_array($origin->stage, $stages, true)) {
            throw InstructionOriginRefused::notAllowed($command, $origin->description());
        }

        return $origin;
    }

    /**
     * @param  class-string  $command
     */
    private static function subjectOf(LifecycleOrigin $origin, string $command): SubjectReference
    {
        $subject = $origin->reference->subject;

        if (! $subject instanceof SubjectReference) {
            throw InstructionOriginRefused::notAllowed($command, $origin->description());
        }

        return $subject;
    }
}
