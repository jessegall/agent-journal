<?php

declare(strict_types=1);

namespace Tests\Unit\Reflection;

use App\Support\ReflectedMethod;
use App\Support\ReflectedType;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Reflection\Attributes\MemberMarker;
use Tests\Fixtures\Reflection\DefaultsParcel;
use Tests\Fixtures\Reflection\Labelled;
use Tests\Fixtures\Reflection\MemberParcel;
use Tests\Fixtures\Reflection\MemberParcelChild;
use Tests\Fixtures\Reflection\Parcel;
use Tests\Fixtures\Reflection\ParcelSize;
use Tests\Fixtures\Reflection\Stamped;

/**
 * A ReflectedType walks its parents only when asked, names its traits, and answers the class, method and parameter
 * questions the declaration readers ask, each kept once read.
 */
final class ReflectorLineageTest extends TestCase
{
    public function test_the_parent_walk_gives_the_class_and_then_each_parent_nearest_first(): void
    {
        $child = ReflectedType::of(MemberParcelChild::class);

        $this->assertSame(
            [MemberParcelChild::class, MemberParcel::class],
            array_map(fn (ReflectedType $class) => $class->name(), $child->lineage()),
        );
        $this->assertSame(ReflectedType::of(MemberParcel::class), $child->parent()->get());
        $this->assertTrue(ReflectedType::of(MemberParcel::class)->parent()->isEmpty());
        $this->assertSame($child->parent(), $child->parent());
    }

    public function test_the_closest_declaration_is_picked_by_walking_the_lineage(): void
    {
        $closest = array_values(array_filter(
            ReflectedType::of(MemberParcelChild::class)->lineage(),
            fn (ReflectedType $class) => $class->method('overridden')->declaringClass() === $class,
        ))[0];

        $this->assertSame(MemberParcelChild::class, $closest->name());
        $this->assertSame('child', $closest->method('overridden')->attribute(MemberMarker::class)->label);
    }

    public function test_methods_list_inherited_members_with_their_declaring_class(): void
    {
        $child = ReflectedType::of(MemberParcelChild::class);
        $inherited = array_values(array_filter(
            $child->methods(),
            fn (ReflectedMethod $method) => $method->name() === 'inherited',
        ))[0];

        $this->assertSame(MemberParcel::class, $inherited->declaringClass()->name());
        $this->assertSame($child->method('inherited'), $inherited);
        $this->assertSame($child->methods(), $child->methods());
    }

    public function test_class_questions_answer_as_php_declares_them(): void
    {
        $this->assertSame('MemberParcelChild', ReflectedType::of(MemberParcelChild::class)->shortName());
        $this->assertSame(
            [Stamped::class],
            array_map(fn (ReflectedType $trait) => $trait->name(), ReflectedType::of(Parcel::class)->traits()),
        );
        $this->assertSame([], ReflectedType::of(MemberParcel::class)->traits());
        $this->assertTrue(ReflectedType::of(Labelled::class)->isInterface());
        $this->assertTrue(ReflectedType::of(ParcelSize::class)->isEnum());
        $this->assertFalse(ReflectedType::of(Parcel::class)->isAbstract());
        $this->assertNotSame(
            ReflectedType::of(DefaultsParcel::class)->newInstanceWithoutConstructor(),
            ReflectedType::of(DefaultsParcel::class)->newInstanceWithoutConstructor(),
        );
    }

    public function test_parameter_questions_answer_defaults_and_modifiers(): void
    {
        $parameters = ReflectedType::of(DefaultsParcel::class)->constructor()->get()->parameters();
        $stamp = ReflectedType::of(DefaultsParcel::class)->method('stamp')->parameters();

        $this->assertSame('self::LIMIT', $parameters[0]->defaultConstantName()->get());
        $this->assertSame(3, $parameters[0]->defaultValue());
        $this->assertTrue($parameters[1]->defaultConstantName()->isEmpty());
        $this->assertSame('parcel', $parameters[1]->defaultValue());
        $this->assertSame(ParcelSize::Small, $parameters[2]->defaultValue());
        $this->assertTrue($parameters[3]->allowsNull());
        $this->assertFalse($parameters[0]->allowsNull());
        $this->assertTrue($stamp[0]->isPassedByReference());
        $this->assertFalse($stamp[0]->hasDefaultValue());
        $this->assertTrue($stamp[1]->isVariadic());
        $this->assertTrue(ReflectedType::of(DefaultsParcel::class)->hasProperty('count'));
    }
}
