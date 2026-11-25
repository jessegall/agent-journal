<?php

declare(strict_types=1);

namespace Tests\Unit\Reflection;

use App\Support\ReflectedEnumCase;
use App\Support\ReflectedType;
use ArrayObject;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Reflection\Attributes\CaseMarker;
use Tests\Fixtures\Reflection\GhostParcel;
use Tests\Fixtures\Reflection\MarkedSize;
use Tests\Fixtures\Reflection\Parcel;
use Tests\Fixtures\Reflection\ParcelSize;
use WeakReference;

/**
 * A ReflectedType keeps its structural answers, an absent file and enum cases included, while the operations that build
 * objects run on every call and keep neither the object nor the initializer.
 */
final class ReflectorOperationsTest extends TestCase
{
    public function test_two_lazy_ghosts_are_independent_and_neither_is_kept(): void
    {
        $reflector = ReflectedType::of(GhostParcel::class);
        $first = $reflector->newLazyGhost(fn (GhostParcel $ghost) => $ghost->__construct('first'));
        $second = $reflector->newLazyGhost(fn (GhostParcel $ghost) => $ghost->__construct('second'));
        $reference = WeakReference::create($first);

        $this->assertNotSame($first, $second);
        $this->assertSame('first', $first->label);
        $this->assertSame('second', $second->label);

        unset($first);

        $this->assertNull($reference->get());
    }

    public function test_building_through_the_constructor_runs_on_every_call(): void
    {
        $reflector = ReflectedType::of(GhostParcel::class);

        $this->assertNotSame($reflector->newInstance('one'), $reflector->newInstance('one'));
        $this->assertSame('two', $reflector->newInstance('two')->label);
    }

    public function test_an_internal_class_has_no_file_and_the_absence_is_kept(): void
    {
        $reflector = ReflectedType::of(ArrayObject::class);

        $this->assertTrue($reflector->fileName()->isEmpty());
        $this->assertSame($reflector->fileName(), $reflector->fileName());
        $this->assertStringEndsWith('Parcel.php', ReflectedType::of(Parcel::class)->fileName()->get());
    }

    public function test_enum_cases_and_their_attributes_are_read_once(): void
    {
        $reflector = ReflectedType::of(MarkedSize::class);
        $cases = $reflector->cases();

        $this->assertSame($cases, $reflector->cases());
        $this->assertSame(['Small', 'Large'], array_map(fn (ReflectedEnumCase $case) => $case->name(), $cases));
        $this->assertSame(MarkedSize::Small, $cases[0]->value());
        $this->assertSame('small', $cases[0]->attribute(CaseMarker::class)->label);
        $this->assertSame($cases[0]->attribute(CaseMarker::class), $cases[0]->attribute(CaseMarker::class));
        $this->assertFalse($cases[1]->hasAttribute(CaseMarker::class));
        $this->assertSame('string', $reflector->backingType()->get());
        $this->assertTrue(ReflectedType::of(ParcelSize::class)->backingType()->isEmpty());
        $this->assertSame([], ReflectedType::of(Parcel::class)->cases());
    }
}
