<?php

declare(strict_types=1);

namespace Tests\Unit\Exports;

use App\Exceptions\MalformedExports;
use App\Support\Exports;
use ArrayObject;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\Events\PlanStarted;
use Domain\Plans\PlansDomain;
use PHPUnit\Framework\TestCase;
use RuntimeException;
use stdClass;
use Tests\Support\DomainBoot;

/**
 * An owner's exports are built one list at a time, never change once built, and refuse a malformed declaration.
 */
final class ExportsTest extends TestCase
{
    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    public function test_each_list_keeps_the_order_its_names_were_added_in(): void
    {
        $exports = Exports::make()->events(PlanStarted::class)->events(
            PlanProgressChanged::class,
        )->values(stdClass::class)->build();

        $this->assertSame([PlanStarted::class, PlanProgressChanged::class], $exports->events);
        $this->assertSame([PlanStarted::class, PlanProgressChanged::class, stdClass::class], $exports->all());
    }

    public function test_a_builder_shared_by_two_callers_gives_two_declarations(): void
    {
        $shared = Exports::make()->values(stdClass::class);

        $first = $shared->contracts(ArrayObject::class)->build();
        $second = $shared->exceptions(RuntimeException::class)->build();

        $this->assertSame([], $first->exceptions);
        $this->assertSame([], $second->contracts);
        $this->assertSame([stdClass::class], $shared->build()->all());
    }

    public function test_membership_ignores_case_and_a_leading_backslash(): void
    {
        $exports = Exports::make()->events(PlanStarted::class)->commands(ArrayObject::class)->build();

        $this->assertTrue($exports->hasEvent('\\'.strtoupper(PlanStarted::class)));
        $this->assertTrue($exports->hasCommand('arrayobject'));
        $this->assertTrue($exports->has(PlanStarted::class));
        $this->assertFalse($exports->hasEvent(ArrayObject::class));
    }

    public function test_a_name_listed_twice_is_refused_naming_both_lists(): void
    {
        $this->expectExceptionObject(MalformedExports::listedTwice('\\stdclass', 'values', 'support'));

        Exports::make()->values(stdClass::class)->support('\\stdclass')->build();
    }

    public function test_an_empty_name_is_refused_naming_its_list(): void
    {
        $this->expectExceptionObject(MalformedExports::emptyName('contracts', 0));

        Exports::make()->contracts('')->build();
    }
}
