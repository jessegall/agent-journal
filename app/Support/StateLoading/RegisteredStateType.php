<?php

declare(strict_types=1);

namespace App\Support\StateLoading;

use App\Attributes\States\StateType;
use App\Attributes\States\Ticks;
use App\Contracts\Work\WorkOccurrenceGuard;
use App\Enums\Sessions\SessionTransferType;
use App\Exceptions\StateTypeUnknown;
use App\Support\Reflector;
use App\Support\States\AgentState;
use Closure;

/**
 * A state type as the registry holds it: the state class with what its StateType attribute says, and whether it runs
 * now, which a domain's switch decides for the states of that domain.
 */
final readonly class RegisteredStateType
{
    /**
     * @param  class-string<AgentState>  $stateClass
     * @param  Closure(): bool  $isOn
     */
    private function __construct(
        public string $key,
        public string $stateClass,
        public int $schemaVersion,
        public SessionTransferType $transfer,
        public Closure $isOn,
    ) {}

    /**
     * The type the state class declares, always switched on.
     *
     * @param  class-string<AgentState>  $class
     */
    public static function of(string $class): self
    {
        $type = Reflector::of($class)->attribute(StateType::class);

        return self::named($type->key, $class, $type->schemaVersion, $type->transfer);
    }

    /**
     * A type under the key given for the state class, always switched on, such as a type a module registers under
     * a key of its own.
     *
     * @param  class-string<AgentState>  $class
     */
    public static function named(
        string $key,
        string $class,
        int $schemaVersion = 1,
        SessionTransferType $transfer = SessionTransferType::SessionOnly,
    ): self {
        return new self($key, $class, $schemaVersion, $transfer, static fn () => true);
    }

    /**
     * The same type, running only while the switch answers yes, as a domain's states run only while it is available.
     *
     * @param  Closure(): bool  $on
     */
    public function switchedBy(Closure $on): self
    {
        return clone ($this, ['isOn' => $on]);
    }

    public function isEnabled(): bool
    {
        return ($this->isOn)();
    }

    public function isTicking(): bool
    {
        return Reflector::of($this->stateClass)->hasAttribute(Ticks::class);
    }

    /**
     * The guard class a ticking state names; a type that does not tick has no tick to guard.
     *
     * @return class-string<WorkOccurrenceGuard>
     *
     * @throws StateTypeUnknown
     */
    public function tickGuard(): string
    {
        if (! $this->isTicking()) {
            throw StateTypeUnknown::forTicking($this->key);
        }

        return Reflector::of($this->stateClass)->attribute(Ticks::class)->guard;
    }
}
