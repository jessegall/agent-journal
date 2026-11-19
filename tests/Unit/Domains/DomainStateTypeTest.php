<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Contracts\DomainAvailability;
use App\Domains\Support\DomainStateType;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Enums\NoSubject;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\ClosureStateLoader;
use Tests\Fixtures\Hooks\ScriptedState;

/**
 * The wrapper loads states exactly as the domain's loader does and asks for its owner's availability every time.
 */
final class DomainStateTypeTest extends TestCase
{
    public function test_it_forwards_loading_and_asks_availability_each_time(): void
    {
        $state = ScriptedState::delegating();
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
        $type = new DomainStateType('Reviews', new ClosureStateLoader(fn () => $state), fn () => $availability);

        $this->assertSame(
            $state,
            $type->statesFor(new StateReferences([new StateReference('reviews.reviewing', NoSubject::None)]))->stateAt(0),
        );
        $this->assertSame(1, $type->schemaVersion());
        $this->assertTrue($type->isEnabled());

        $availability->available = false;

        $this->assertFalse($type->isEnabled());
        $this->assertSame(['Reviews', 'Reviews'], $availability->asked);
    }
}
