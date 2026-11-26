<?php

declare(strict_types=1);

namespace Tests\Unit\Reflection;

use App\Reflection\Exceptions\ClassMissing;
use App\Support\Reflector;
use ArrayObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Process\Process;
use Tests\Fixtures\Reflection\Labelled;
use Tests\Fixtures\Reflection\Parcel;
use Tests\Fixtures\Reflection\ParcelSize;
use Tests\Fixtures\Reflection\Stamped;
use WeakReference;

/**
 * One Reflector per loaded type in a process, whatever spelling or object names the type, with no object kept and no
 * missing name remembered. It needs no Laravel application: this test case boots none.
 */
final class ReflectorCatalogueTest extends TestCase
{
    public function test_a_class_name_and_an_object_of_it_share_one_reflector(): void
    {
        $reflector = Reflector::of(Parcel::class);

        $this->assertSame($reflector, Reflector::of(new Parcel()));
        $this->assertSame($reflector, Reflector::of(new Parcel()));
        $this->assertSame(Parcel::class, $reflector->name());
    }

    public function test_an_alias_a_leading_backslash_and_another_letter_case_reach_the_canonical_reflector(): void
    {
        if (! Reflector::exists('Tests\Fixtures\Reflection\ParcelAlias')) {
            class_alias(Parcel::class, 'Tests\Fixtures\Reflection\ParcelAlias');
        }

        $reflector = Reflector::of(Parcel::class);

        $this->assertSame($reflector, Reflector::of('Tests\Fixtures\Reflection\ParcelAlias'));
        $this->assertSame($reflector, Reflector::of('\\'.Parcel::class));
        $this->assertSame($reflector, Reflector::of('tests\fixtures\reflection\PARCEL'));
        $this->assertSame(Parcel::class, Reflector::of('TESTS\FIXTURES\REFLECTION\parcel')->name());
    }

    public function test_an_unknown_name_fails_every_time_it_is_asked(): void
    {
        foreach ([1, 2] as $attempt) {
            try {
                Reflector::of('Tests\Fixtures\Reflection\NoSuchParcel');
                $this->fail("Attempt {$attempt} found a class that does not exist.");
            } catch (ClassMissing $missing) {
                $this->assertStringContainsString('Tests\Fixtures\Reflection\NoSuchParcel', $missing->getMessage());
            }
        }
    }

    public function test_the_reflected_object_is_not_kept_alive(): void
    {
        $parcel = new Parcel();
        $reference = WeakReference::create($parcel);

        Reflector::of($parcel);
        unset($parcel);

        $this->assertNull($reference->get());
    }

    public function test_interfaces_traits_enums_anonymous_and_internal_classes_are_reflected(): void
    {
        $anonymous = new class {};

        $this->assertSame(Labelled::class, Reflector::of(Labelled::class)->name());
        $this->assertSame(Stamped::class, Reflector::of(Stamped::class)->name());
        $this->assertSame(ParcelSize::class, Reflector::of(ParcelSize::Small)->name());
        $this->assertSame($anonymous::class, Reflector::of($anonymous)->name());
        $this->assertSame(Reflector::of($anonymous), Reflector::of($anonymous::class));
        $this->assertSame(ArrayObject::class, Reflector::of('arrayobject')->name());
    }

    public function test_a_new_process_builds_its_own_catalogue_before_any_application_exists(): void
    {
        $script = 'require "vendor/autoload.php"; echo App\Support\Reflector::of("arrayobject")->name();';
        $process = new Process([PHP_BINARY, '-r', $script], dirname(__DIR__, 3));

        $process->mustRun();

        $this->assertSame(ArrayObject::class, $process->getOutput());
    }
}
