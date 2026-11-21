<?php

declare(strict_types=1);

namespace Tests\Fixtures\PhpStan;

use App\Bus\Attributes\RetainedActorRequestKey;
use App\Reflection\Concerns\Reflects;
use App\Reflection\Support\Reflector;
use Tests\Fixtures\Reflection\Attributes\Marker;
use Tests\Fixtures\Reflection\Parcel;

use function PHPStan\Testing\assertType;

/**
 * The types PHPStan infers for the reflection wrapper's reads; ReflectorTypesTest checks each assertType.
 */
class ReflectorTypes
{
    use Reflects;

    public function reflectorTypes(Parcel $parcel): void
    {
        assertType('App\Reflection\Support\Reflector<static(Tests\Fixtures\PhpStan\ReflectorTypes)>', $this->reflect());
        assertType('App\Reflection\Support\Reflector<Tests\Fixtures\Reflection\Parcel>', static::reflect(Parcel::class));
        assertType('App\Reflection\Support\Reflector<Tests\Fixtures\Reflection\Parcel>', static::reflect($parcel));
        assertType('App\Reflection\Support\Reflector<Tests\Fixtures\Reflection\Parcel>', Reflector::of(Parcel::class));
        assertType('App\Reflection\Support\Reflector<Tests\Fixtures\Reflection\Parcel>', Reflector::of($parcel));
    }

    public function attributeTypes(): void
    {
        assertType('App\Bus\Attributes\RetainedActorRequestKey', $this->reflect()->attribute(RetainedActorRequestKey::class));
        assertType(
            'PhpOption\Option<App\Bus\Attributes\RetainedActorRequestKey>',
            $this->reflect()->attributes(RetainedActorRequestKey::class)->first(),
        );
        assertType('App\Bus\Attributes\RetainedActorRequestKey', $this->reflect()->attributes(RetainedActorRequestKey::class)->first()->get());

        foreach (static::reflect(Parcel::class)->attributes(Marker::class) as $marker) {
            assertType('Tests\Fixtures\Reflection\Attributes\Marker', $marker);
        }
    }
}
