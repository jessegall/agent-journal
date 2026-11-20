<?php

declare(strict_types=1);

namespace App\Scripts\Values;

final readonly class ObjectDefinition
{
    /**
     * @param  class-string  $class
     * @param  array<string, ObjectMember>  $members
     */
    public function __construct(
        public string $key,
        public string $class,
        public string $owner,
        public string $contextParameter,
        public array $members,
    ) {}
}
