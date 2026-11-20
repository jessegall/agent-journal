<?php

declare(strict_types=1);

namespace App\Hooks\StateEvents;

use App\Agents\Support\StackTarget;
use App\Hooks\Exceptions\StateEventReentry;
use Closure;
use Illuminate\Container\Attributes\Scoped;

/**
 * Tracks stack evaluation and active frame/event deliveries in this request.
 */
#[Scoped]
final class StateEventActivity
{
    private const int MAXIMUM_DEPTH = 10;

    /**
     * @var array<string, true>
     */
    private array $evaluating = [];

    /**
     * @var list<array<string, true>>
     */
    private array $deliveries = [];

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function evaluate(StackTarget $target, Closure $work): mixed
    {
        $before = $this->evaluating;
        $this->evaluating[$target->description()] = true;

        try {
            return $work();
        } finally {
            $this->evaluating = $before;
        }
    }

    public function assertNotReentered(StackTarget $target): void
    {
        if (isset($this->evaluating[$target->description()])) {
            throw StateEventReentry::duringEvaluation($target);
        }
    }

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function delivering(Closure $work): mixed
    {
        if (count($this->deliveries) >= self::MAXIMUM_DEPTH) {
            throw StateEventReentry::depth(self::MAXIMUM_DEPTH);
        }

        $this->deliveries[] = [];

        try {
            return $work();
        } finally {
            array_pop($this->deliveries);
        }
    }

    public function trackOrigin(StackTarget $target, string $frame, string $event): void
    {
        $delivery = array_key_last($this->deliveries);

        if ($delivery === null) {
            throw StateEventReentry::outsideDelivery();
        }

        $key = $target->description()."/{$frame}/{$event}";

        foreach ($this->deliveries as $active) {
            if (isset($active[$key])) {
                throw StateEventReentry::cycle($target, $frame, $event);
            }
        }

        $this->deliveries[$delivery][$key] = true;
    }
}
