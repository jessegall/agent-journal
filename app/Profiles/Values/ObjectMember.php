<?php

declare(strict_types=1);

namespace App\Profiles\Values;

final readonly class ObjectMember
{
    /**
     * @param  string  $name  the word a script names the member by
     * @param  string  $property  the object's property that holds its value
     */
    public function __construct(public string $name, public string $property, public OperationKey $read) {}
}
