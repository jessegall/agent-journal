<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use App\Bootstrap\Exceptions\TraitInterfaceMissing;
use App\Bootstrap\TraitRequirements;
use App\Support\DomainEntry;
use Tests\Fixtures\Domains\Stateless\StatelessDomain;
use Tests\Fixtures\TraitRequirements\PoliteGreeter;
use Tests\Fixtures\TraitRequirements\RudeGreeter;
use Tests\TestCase;

/**
 * A trait marked with RequiresInterface refuses a class that uses it without the interface, wherever the container
 * resolves that class and when a domain boots.
 */
final class TraitRequirementsTest extends TestCase
{
    public function test_the_container_resolves_a_class_that_implements_what_its_trait_needs(): void
    {
        $this->assertSame('Hello', $this->app->make(PoliteGreeter::class)->greeting());
    }

    public function test_the_container_refuses_a_class_that_lacks_what_its_trait_needs(): void
    {
        $this->expectException(TraitInterfaceMissing::class);
        $this->expectExceptionMessage(RudeGreeter::class);

        $this->app->make(RudeGreeter::class);
    }

    public function test_a_domain_using_the_states_trait_without_declaring_states_is_refused_at_boot(): void
    {
        $this->expectException(TraitInterfaceMissing::class);
        $this->expectExceptionMessage('StateProvider');

        DomainEntry::fromClass(StatelessDomain::class)->boot($this->app);
    }

    public function test_a_class_is_checked_once_and_then_answered_from_what_was_checked(): void
    {
        $requirements = $this->app->make(TraitRequirements::class);
        $requirements->assertMetBy(PoliteGreeter::class);

        $this->assertTrue($requirements->hasChecked(PoliteGreeter::class));
        $this->assertFalse($requirements->hasChecked(RudeGreeter::class));
    }
}
