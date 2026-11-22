<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Scripts\ScriptExecution;
use App\Values\AccessPolicy;
use App\Values\BooleanOperand;
use App\Values\NamedCommand;
use App\Values\ObjectRead;
use App\Values\Operation;
use App\Values\ResourceRequest;
use App\Values\ScriptContext;
use App\Values\StepOutcome;

/**
 * Takes one step of a profile run: a condition is read through the run's objects, a command waits for the host to
 * run it, and guidance hands the stop back to the actor.
 */
final readonly class ProfileRunExecution implements ScriptExecution
{
    /**
     * The most characters of evidence a step keeps.
     */
    private const int EVIDENCE_LIMIT = 2000;

    public function __construct(
        private ObjectReader $reader,
        private ScriptContext $context,
        private AccessPolicy $access,
        private string $step,
    ) {}

    /**
     * A command the profile's access grants waits for the host to run it once for this step; one it does not grant
     * fails before anything runs.
     */
    public function run(NamedCommand $command): StepOutcome
    {
        $operation = new Operation('script', 'profile.command:'.$command->key, $command->effects, [
            ResourceRequest::path('.'),
        ], [], 1);

        $decision = $this->access->decide($operation);

        if (! $decision->allowed) {
            return StepOutcome::failed("RUN {$command->key} is refused: {$decision->reason}");
        }

        return StepOutcome::pending($this->step);
    }

    public function check(BooleanOperand $condition): StepOutcome
    {
        $read = $this->read($condition);

        if ($read->unread !== null) {
            return $read->unread;
        }

        return $this->holds($condition, $read)
            ? StepOutcome::completed('passed')
            : StepOutcome::failed("CHECK {$this->subject($condition)} does not hold.");
    }

    public function branch(BooleanOperand $condition): StepOutcome
    {
        $read = $this->read($condition);

        if ($read->unread !== null) {
            return $read->unread;
        }

        return StepOutcome::completed($this->holds($condition, $read) ? 'true' : 'false');
    }

    public function yieldToActor(string $guidance): StepOutcome
    {
        return StepOutcome::completed('returned', $guidance);
    }

    public function recordEvidence(string $text): StepOutcome
    {
        return StepOutcome::completed('passed', mb_substr($text, 0, self::EVIDENCE_LIMIT));
    }

    private function read(BooleanOperand $condition): ObjectRead
    {
        return $this->reader->read($condition->object, $condition->member, $this->context);
    }

    private function holds(BooleanOperand $condition, ObjectRead $read): bool
    {
        return ($read->value === true) !== $condition->isNegated;
    }

    private function subject(BooleanOperand $condition): string
    {
        return ($condition->isNegated ? 'NOT ' : '')."{$condition->object}.{$condition->member}";
    }
}
