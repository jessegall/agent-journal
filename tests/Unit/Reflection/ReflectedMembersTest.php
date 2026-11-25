<?php

declare(strict_types=1);

namespace Tests\Unit\Reflection;

use App\Enums\Engine\TypeShape;
use App\Exceptions\MethodMissing;
use App\Exceptions\TypeNotNamed;
use App\Support\ReflectedProperty;
use App\Support\Reflector;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Reflection\Attributes\MemberMarker;
use Tests\Fixtures\Reflection\Labelled;
use Tests\Fixtures\Reflection\MemberParcel;
use Tests\Fixtures\Reflection\MemberParcelChild;
use Tests\Fixtures\Reflection\Parcel;
use Tests\Fixtures\Reflection\Stamps;

/**
 * A Reflector's properties, methods and parameters answer as PHP declares them, each read once, with their own
 * attributes and their types written as PHP writes them.
 */
final class ReflectedMembersTest extends TestCase
{
    private const string WEIGHT_DOC_COMMENT = "/**\n     * The weight in grams.\n     */";

    public function test_a_repeated_read_reuses_the_kept_descriptor(): void
    {
        $reflector = Reflector::of(MemberParcel::class);

        $this->assertSame($reflector->method('weight'), $reflector->method('WEIGHT'));
        $this->assertSame($reflector->properties(), $reflector->properties());
        $this->assertSame($reflector->method('weight')->parameters(), $reflector->method('weight')->parameters());
        $this->assertSame($reflector->method('__construct'), $reflector->constructor()->get());
    }

    public function test_a_property_and_a_method_of_one_name_keep_their_own_markers(): void
    {
        $reflector = Reflector::of(MemberParcel::class);
        $property = self::propertyNamed($reflector->properties(), 'weight');

        $this->assertSame('property', $property->attribute(MemberMarker::class)->label);
        $this->assertSame('method', $reflector->method('weight')->attribute(MemberMarker::class)->label);
        $this->assertSame(self::WEIGHT_DOC_COMMENT, $property->docComment()->get());
        $this->assertTrue($property->isPublic());
        $this->assertFalse($property->isPromoted());
        $this->assertTrue(self::propertyNamed($reflector->properties(), 'label')->isPromoted());
    }

    public function test_an_inherited_and_an_overridden_method_each_give_their_own_declarations(): void
    {
        $child = Reflector::of(MemberParcelChild::class);

        $this->assertSame('inherited', $child->method('inherited')->attribute(MemberMarker::class)->label);
        $this->assertSame(MemberParcel::class, $child->method('inherited')->declaringClass()->name());
        $this->assertSame('child', $child->method('overridden')->attribute(MemberMarker::class)->label);
        $this->assertSame(MemberParcelChild::class, $child->method('overridden')->declaringClass()->name());
        $this->assertSame('parent', Reflector::of(MemberParcel::class)->method('overridden')->attribute(MemberMarker::class)->label);
    }

    public function test_types_are_described_as_php_writes_them(): void
    {
        $reflector = Reflector::of(MemberParcel::class);
        $weight = $reflector->method('weight');
        $grams = $weight->parameters()[0]->type()->get();
        $parcel = $weight->parameters()[1]->type()->get();
        $result = $weight->returnType()->get();
        $label = self::propertyNamed($reflector->properties(), 'label')->type()->get();

        $this->assertSame('?int', $grams->text);
        $this->assertSame(TypeShape::Named, $grams->shape);
        $this->assertTrue($grams->allowsNull);
        $this->assertSame('int', $grams->name());
        $this->assertTrue($grams->isBuiltin());
        $this->assertTrue($parcel->isNamedAs(Parcel::class));
        $this->assertFalse($parcel->isBuiltin());
        $this->assertSame(TypeShape::Union, $result->shape);
        $this->assertSame(Parcel::class.'|int', $result->text);
        $this->assertSame(TypeShape::Intersection, $label->shape);
        $this->assertSame(Labelled::class.'&'.Stamps::class, $label->text);
        $this->assertCount(2, $label->members);
        $this->assertSame(2, $weight->requiredParameterCount());
        $this->assertTrue($reflector->method('inherited')->returnType()->get()->isNamedAs('void'));

        $this->expectException(TypeNotNamed::class);

        $label->name();
    }

    public function test_a_missing_method_fails_by_name(): void
    {
        $this->expectException(MethodMissing::class);
        $this->expectExceptionMessage(MethodMissing::on(MemberParcel::class, 'absent')->getMessage());

        Reflector::of(MemberParcel::class)->method('absent');
    }

    /**
     * @param  list<ReflectedProperty>  $properties
     */
    private static function propertyNamed(array $properties, string $name): ReflectedProperty
    {
        return array_values(array_filter($properties, fn (ReflectedProperty $property) => $property->name() === $name))[0];
    }
}
