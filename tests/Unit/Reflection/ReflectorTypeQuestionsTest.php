<?php

declare(strict_types=1);

namespace Tests\Unit\Reflection;

use App\Contracts\ReflectorFactory;
use App\Exceptions\QuestionNotNegatable;
use App\Support\CatalogueReflectorFactory;
use App\Support\Reflector;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Reflection\Labelled;
use Tests\Fixtures\Reflection\MarkedParcel;
use Tests\Fixtures\Reflection\Parcel;
use Tests\Fixtures\Reflection\ParcelSize;
use Tests\Fixtures\Reflection\Stamped;

/**
 * A Reflector answers every question about a type that callers used PHP's type functions for, its not() view answers
 * each the other way, and the factory hands out the same Reflectors as Reflector::of.
 */
final class ReflectorTypeQuestionsTest extends TestCase
{
    public function test_a_name_that_loads_nothing_answers_no_and_keeps_nothing(): void
    {
        $this->assertFalse(Reflector::exists('Tests\Fixtures\Reflection\NoSuchParcel'));
        $this->assertTrue(Reflector::find('Tests\Fixtures\Reflection\NoSuchParcel')->isEmpty());
        $this->assertFalse(Reflector::factory()->isSubclassOf('Tests\Fixtures\Reflection\NoSuchParcel', Parcel::class));
        $this->assertTrue(Reflector::factory()->isSubclassOf(MarkedParcel::class, Parcel::class));
        $this->assertSame(Reflector::of(Parcel::class), Reflector::find(Parcel::class)->get());
    }

    public function test_the_type_questions_answer_as_php_does(): void
    {
        $parcel = Reflector::of(Parcel::class);
        $marked = Reflector::of(MarkedParcel::class);

        $this->assertTrue($parcel->isClass());
        $this->assertFalse(Reflector::of(Labelled::class)->isClass());
        $this->assertTrue($parcel->is(Parcel::class));
        $this->assertFalse($parcel->isSubclassOf(Parcel::class));
        $this->assertTrue($marked->isSubclassOf(Parcel::class));
        $this->assertTrue($marked->implements(Labelled::class));
        $this->assertFalse($marked->implements(Parcel::class));
        $this->assertTrue($marked->uses(Stamped::class));
        $this->assertTrue($parcel->isInstance(new MarkedParcel()));
        $this->assertFalse($marked->isInstance(new Parcel()));
        $this->assertFalse($parcel->isInstance('Tests\Fixtures\Reflection\Parcel'));
        $this->assertSame([Labelled::class], array_map(fn (Reflector $type) => $type->name(), $parcel->interfaces()));
        $this->assertTrue(Reflector::of(ParcelSize::class)->isEnum());
    }

    public function test_not_answers_each_question_the_other_way(): void
    {
        $marked = Reflector::of(MarkedParcel::class);

        $this->assertFalse($marked->not()->isSubclassOf(Parcel::class));
        $this->assertTrue($marked->not()->isAbstract());
        $this->assertTrue($marked->not()->is(ParcelSize::class));
        $this->assertTrue($marked->not()->hasMethod('absent'));
        $this->assertFalse($marked->not()->uses(Stamped::class));
    }

    public function test_not_refuses_a_method_that_answers_no_yes_or_no(): void
    {
        $this->expectException(QuestionNotNegatable::class);

        Reflector::of(MarkedParcel::class)->not()->name();
    }

    public function test_the_factory_hands_out_the_catalogue_reflectors_for_a_name_or_an_object(): void
    {
        $factory = new CatalogueReflectorFactory();

        $this->assertInstanceOf(ReflectorFactory::class, $factory);
        $this->assertSame(Reflector::of(Parcel::class), $factory->make(Parcel::class));
        $this->assertSame(Reflector::of(Parcel::class), $factory->make(new Parcel()));
    }
}
