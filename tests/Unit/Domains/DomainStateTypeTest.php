<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Contracts\DomainAvailability;
use App\Domains\Support\DomainStateType;
use App\Domains\Support\DomainTickableStateType;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Enums\NoSubject;
use App\Hooks\References\StateReference;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\ClosureStateLoader;
use Tests\Fixtures\Hooks\ScriptedState;
use Tests\Fixtures\Hooks\Ticks\TickingLoader;
use Tests\Fixtures\Hooks\Ticks\TickingState;
use Tests\Support\Exceptions\SimulatedFailure;

/**
 * The wrapper loads states exactly as the domain's loader does and asks for its owner's availability every time.
 */
final class DomainStateTypeTest extends TestCase
{
    public function test_it_forwards_loading_and_asks_availability_each_time(): void
    {
        $state = ScriptedState::passing();
        $available = true;
        $availability = new class($available) implements DomainAvailability
        {
            /**
             * @var list<string>
             */
            public array $asked = [];

            public function __construct(public bool $available) {}

            public function isEnabled(string $owner): bool
            {
                $this->asked[] = $owner;

                return $this->available;
            }
        };
        $loader = new ClosureStateLoader(ScriptedState::class, fn () => $state);
        $type = new DomainStateType('Reviews', $loader, fn () => $availability);

        $this->assertSame(
            $state,
            $type->statesFor(
                new StateReferences([new StateReference('reviews.reviewing', NoSubject::None)]),
            )->stateAt(0),
        );
        $this->assertSame(ScriptedState::class, $type->stateClass());
        $this->assertSame(1, $type->schemaVersion());
        $this->assertTrue($type->isEnabled());

        $availability->available = false;

        $this->assertFalse($type->isEnabled());
        $this->assertSame(['Reviews', 'Reviews'], $availability->asked);
    }

    public function test_ticking_wrapper_identifies_the_state_without_loading_subjects_or_availability(): void
    {
        $loader = new TickingLoader(fn () => throw SimulatedFailure::of('Unexpected subject read.'));
        $type = new DomainStateType('Reviews', $loader, fn () => throw SimulatedFailure::of('Unexpected lookup.'));
        $ticking = new DomainTickableStateType($type, $loader);

        $this->assertSame(TickingState::class, $ticking->stateClass());
    }
}
