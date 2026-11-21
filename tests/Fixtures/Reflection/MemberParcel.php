<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection;

use Tests\Fixtures\Reflection\Attributes\MemberMarker;

/**
 * A class whose members the member descriptors read: a property and a method of one name, typed parameters, and a
 * method its subclass inherits and one it overrides.
 */
class MemberParcel
{
    /**
     * The weight in grams.
     */
    #[MemberMarker('property')]
    public int|null $weight = null;

    public function __construct(public readonly Labelled&Stamps $label) {}

    #[MemberMarker('method')]
    public function weight(int|null $grams, Parcel $parcel): Parcel|int
    {
        return $grams ?? $parcel;
    }

    #[MemberMarker('inherited')]
    public function inherited(): void {}

    #[MemberMarker('parent')]
    public function overridden(): void {}
}
