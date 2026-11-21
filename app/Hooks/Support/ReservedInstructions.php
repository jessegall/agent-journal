<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Hooks\Commands\FocusInstruction;
use App\Hooks\Commands\RefreshPlanInstruction;
use App\Hooks\Commands\ReleaseInstruction;
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
     * The state types that may mark their instruction, each with the instruction type its marker holds.
     */
    public const array INSTRUCTION_TYPES = [
        'tasks.working' => 'tasks.task',
        'plans.working' => 'plans.plan',
        'communication.answering' => 'communication.message',
        'sequences.following' => 'sequences.step',
        'skills.awaiting' => 'skills.delivery',
        'supervision.answering' => 'supervision.ask',
    ];

    /**
     * Each reserved command with the callbacks it may come from, and the state types it serves.
     */
    public const array ALLOWED = [
        FocusInstruction::class => [[LifecycleStage::Enter, LifecycleStage::Resume], self::INSTRUCTION_TYPES],
        ReleaseInstruction::class => [[LifecycleStage::Exit], self::INSTRUCTION_TYPES],
        RefreshPlanInstruction::class => [[LifecycleStage::Event], ['plans.working' => 'plans.plan']],
    ];

    public function __construct(private LifecycleOrigins $origins, private InstructionMarkers $markers) {}

    /**
     * Replaces the marker of the frame the command came from.
     *
     * @param  class-string  $command
     */
    public function focus(string $command): void
    {
        $origin = $this->originFor($command);
        $subject = self::subjectOf($origin, $command);

        $instructionType = self::ALLOWED[$command][1][$origin->reference->typeKey];
        $marker = new InstructionMarker($instructionType, $subject->id, $subject->runNumber);
        $this->markers->replace($origin->target, $origin->frameId, $marker);
    }

    /**
     * Refreshes the plan frame's marker only when the plan the fact names is the frame's own plan.
     *
     * @param  class-string  $command
     */
    public function refresh(string $command, string $planId): void
    {
        $origin = $this->originFor($command);
        $subject = self::subjectOf($origin, $command);

        if ($subject->id !== $planId) {
            throw InstructionOriginRefused::otherSubject($command, $origin->description());
        }

        $marker = new InstructionMarker(self::ALLOWED[$command][1][$origin->reference->typeKey], $planId, 0);
        $this->markers->replace($origin->target, $origin->frameId, $marker);
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
        [$stages, $types] = self::ALLOWED[$command];

        if (! array_key_exists($origin->reference->typeKey, $types) || ! in_array($origin->stage, $stages, true)) {
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
