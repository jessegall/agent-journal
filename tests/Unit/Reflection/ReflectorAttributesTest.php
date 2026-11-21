<?php

declare(strict_types=1);

namespace Tests\Unit\Reflection;

use App\Reflection\Exceptions\AttributeBuiltRecursively;
use App\Reflection\Exceptions\AttributeMissing;
use App\Reflection\Support\Reflector;
use PHPUnit\Framework\TestCase;
use RuntimeException;
use Tests\Fixtures\Reflection\Attributes\BaseMarker;
use Tests\Fixtures\Reflection\Attributes\DerivedMarker;
use Tests\Fixtures\Reflection\Attributes\Describes;
use Tests\Fixtures\Reflection\Attributes\FailingMarker;
use Tests\Fixtures\Reflection\Attributes\Marker;
use Tests\Fixtures\Reflection\Attributes\SelfReadingMarker;
use Tests\Fixtures\Reflection\FailingParcel;
use Tests\Fixtures\Reflection\MarkedParcel;
use Tests\Fixtures\Reflection\Parcel;
use Tests\Fixtures\Reflection\SelfReadingParcel;
use Tests\Fixtures\Reflection\TwiceMarkedParcel;

/**
 * A Reflector selects a type's attributes by class, in declaration order, builds each only when it is read and keeps
 * every answer, an empty one too.
 */
final class ReflectorAttributesTest extends TestCase
{
    public function test_counting_and_asking_for_presence_build_nothing(): void
    {
        $built = Marker::$built;
        $reflector = Reflector::of(MarkedParcel::class);

        $this->assertCount(2, $reflector->attributes(Marker::class));
        $this->assertTrue($reflector->hasAttribute(Marker::class));
        $this->assertSame(['first'], $reflector->attributes(Marker::class)->entries()[0]->arguments());
        $this->assertSame($built, Marker::$built);
    }

    public function test_the_required_read_builds_only_the_first_occurrence_and_only_once(): void
    {
        $reflector = Reflector::of(TwiceMarkedParcel::class);
        $built = Marker::$built;

        $marker = $reflector->attribute(Marker::class);

        $this->assertSame($built + 1, Marker::$built);
        $this->assertSame($marker, $reflector->attribute(Marker::class));
        $this->assertSame($marker, $reflector->attributes(Marker::class)->first()->get());
        $this->assertSame($built + 1, Marker::$built);

        $markers = iterator_to_array($reflector->attributes(Marker::class));

        $this->assertSame($built + 2, Marker::$built);
        $this->assertNotSame($markers[0], $markers[1]);
        $this->assertSame($marker, $markers[0]);
    }

    public function test_iteration_gives_every_occurrence_in_order_and_a_second_read_builds_nothing_new(): void
    {
        $reflector = Reflector::of(MarkedParcel::class);

        $labels = array_map(fn (Marker $marker) => $marker->label, iterator_to_array($reflector->attributes(Marker::class)));
        $built = Marker::$built;
        $again = iterator_to_array($reflector->attributes(Marker::class));

        $this->assertSame(['first', 'second'], $labels);
        $this->assertCount(2, $again);
        $this->assertNotSame($again[0], $again[1]);
        $this->assertSame($built, Marker::$built);
    }

    public function test_an_absent_attribute_is_missing_for_the_required_read_and_none_for_the_optional_one(): void
    {
        $reflector = Reflector::of(MarkedParcel::class);

        $this->assertTrue($reflector->attributes(FailingMarker::class)->first()->isEmpty());
        $this->assertFalse($reflector->hasAttribute(FailingMarker::class));
        $this->assertSame($reflector->attributes(FailingMarker::class), $reflector->attributes(FailingMarker::class));

        $this->expectException(AttributeMissing::class);
        $this->expectExceptionMessage('class '.MarkedParcel::class.' carries no attribute '.FailingMarker::class);

        $reflector->attribute(FailingMarker::class);
    }

    public function test_a_class_attribute_is_not_read_from_the_parent(): void
    {
        $this->assertSame('parcel', Reflector::of(Parcel::class)->attribute(Marker::class)->label);
        $this->assertSame(
            ['first', 'second'],
            array_map(fn (Marker $marker) => $marker->label, iterator_to_array(Reflector::of(MarkedParcel::class)->attributes(Marker::class))),
        );
    }

    public function test_an_exact_selection_excludes_a_derived_attribute_and_an_implementing_one_includes_it(): void
    {
        $reflector = Reflector::of(MarkedParcel::class);

        $this->assertCount(0, $reflector->attributes(BaseMarker::class));
        $this->assertCount(1, $reflector->attributesImplementing(BaseMarker::class));
        $this->assertInstanceOf(DerivedMarker::class, $reflector->attributesImplementing(Describes::class)->first()->get());
        $this->assertSame(
            $reflector->attributesImplementing(Describes::class)->first()->get(),
            $reflector->attribute(DerivedMarker::class),
        );
    }

    public function test_a_failing_constructor_throws_its_cause_every_time(): void
    {
        $reflector = Reflector::of(FailingParcel::class);

        foreach ([1, 2] as $attempt) {
            try {
                $reflector->attribute(FailingMarker::class);
                $this->fail("Attempt {$attempt} built a marker that always throws.");
            } catch (RuntimeException $failure) {
                $this->assertSame('The marker refuses to be built.', $failure->getMessage());
                $this->assertSame('the cause', $failure->getPrevious()?->getMessage());
            }
        }

        $this->assertTrue($reflector->hasAttribute(FailingMarker::class));
    }

    public function test_an_attribute_that_reads_itself_while_built_fails_by_name_and_can_be_read_again(): void
    {
        foreach ([1, 2] as $attempt) {
            try {
                Reflector::of(SelfReadingParcel::class)->attribute(SelfReadingMarker::class);
                $this->fail("Attempt {$attempt} built a marker that reads itself.");
            } catch (AttributeBuiltRecursively $recursion) {
                $this->assertStringContainsString(SelfReadingMarker::class, $recursion->getMessage());
            }
        }
    }
}
