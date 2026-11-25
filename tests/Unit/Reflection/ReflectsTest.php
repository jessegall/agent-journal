<?php

declare(strict_types=1);

namespace Tests\Unit\Reflection;

use App\Support\ReflectedProperty;
use App\Support\ReflectedType;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Reflection\Parcel;
use Tests\Fixtures\Reflection\ReadonlyReflectingParcel;
use Tests\Fixtures\Reflection\ReflectingParcel;
use Tests\Fixtures\Reflection\ReflectingParcelChild;
use Tests\Fixtures\Reflection\ReflectingSize;

/**
 * The Reflects trait reflects the class that calls it, a subclass as itself, or the target it is given, and adds no
 * state to the class that uses it.
 */
final class ReflectsTest extends TestCase
{
    public function test_a_class_reflects_itself_and_a_subclass_reflects_the_subclass(): void
    {
        $this->assertSame(ReflectedType::of(ReflectingParcel::class), new ReflectingParcel()->reflectorOfItself());
        $this->assertSame(ReflectedType::of(ReflectingParcelChild::class), new ReflectingParcelChild()->reflectorOfItself());
    }

    public function test_a_given_target_is_reflected_instead_of_the_caller(): void
    {
        $this->assertSame(ReflectedType::of(Parcel::class), new ReflectingParcel()->reflectorOf(new Parcel()));
    }

    public function test_a_final_readonly_class_and_an_enum_use_the_trait_without_a_property_of_its_own(): void
    {
        $this->assertSame(ReadonlyReflectingParcel::class, ReadonlyReflectingParcel::reflector()->name());
        $this->assertSame(ReflectingSize::class, ReflectingSize::Large->reflector()->name());
        $this->assertSame(['label'], array_map(
            fn (ReflectedProperty $property) => $property->name(),
            ReadonlyReflectingParcel::reflector()->properties(),
        ));
    }
}
