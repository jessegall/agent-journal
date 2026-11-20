<?php

declare(strict_types=1);

namespace App\Scripts\Values;

final readonly class FlowShape
{
    /**
     * @param list<string> $ports
     */
    private function __construct(public array $ports) {}

    /**
     * @param list<string> $ports
     */
    public static function action(array $ports): self
    {
        return new self($ports);
    }

    /**
     * @param list<string> $ports
     */
    public static function branch(array $ports): self
    {
        return new self($ports);
    }
}
