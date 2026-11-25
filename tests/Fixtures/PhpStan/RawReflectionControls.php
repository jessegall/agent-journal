<?php

declare(strict_types=1);

namespace Tests\Fixtures\PhpStan;

use App\Support\ReflectedType;
use Illuminate\Database\Eloquent\Model;
use ReflectionException;
use Tests\Fixtures\Reflection\Attributes\Marker;
use Tests\Fixtures\Reflection\Parcel;

/**
 * Code the reflection rule leaves alone: the wrapper, an Eloquent row read, an unrelated factory, a comment and a
 * caught reflection exception.
 */
final class RawReflectionControls
{
    public function wrapper(): Marker
    {
        return ReflectedType::of(Parcel::class)->attribute(Marker::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function rowAttributes(Model $model): array
    {
        return $model->getAttributes();
    }

    public function factory(RawReflectionFactory $factory): RawReflectionFactory
    {
        // new \ReflectionClass($factory)->getAttributes() is what this comment says, not what the code does
        return $factory->newInstance();
    }

    public function caught(): string
    {
        try {
            return 'ReflectionClass';
        } catch (ReflectionException $failure) {
            return $failure->getMessage();
        }
    }
}
