<?php

declare(strict_types=1);

namespace App\Hooks\StateLoading;

use App\Hooks\Decisions\StateReferences;
use App\Hooks\Exceptions\StateClassMismatch;
use App\Hooks\Exceptions\StateSubjectMissing;
use App\Hooks\References\StateReference;
use App\Hooks\States\AgentState;
use Closure;

/**
 * The state of each reference of one batch, by its place in the batch; a reference whose subject is gone has none,
 * and asking for it is refused.
 */
final readonly class StateSet
{
    /**
     * @param  array<int, AgentState>  $states
     */
    private function __construct(public array $states, public string $typeKey) {}

    /**
     * Builds each reference's state with the subjects already read for the whole batch.
     *
     * @param  Closure(StateReference): AgentState  $of  throws StateSubjectMissing for a subject that is gone
     */
    public static function build(StateReferences $references, Closure $of): self
    {
        $states = [];
        $typeKey = '';

        foreach ($references->references as $position => $reference) {
            $typeKey = $reference->typeKey;

            try {
                $states[$position] = $of($reference);
            } catch (StateSubjectMissing) {
                continue;
            }
        }

        return new self($states, $typeKey);
    }

    /**
     * @param  class-string<AgentState>  $class
     */
    public function stateOfClassAt(int $position, string $class): AgentState
    {
        $state = $this->stateAt($position);

        if ($state::class !== $class) {
            throw StateClassMismatch::for($this->typeKey, $class, $state::class);
        }

        return $state;
    }

    /**
     * @throws StateSubjectMissing
     */
    public function stateAt(int $position): AgentState
    {
        return $this->states[$position] ?? throw StateSubjectMissing::for($this->typeKey);
    }
}
