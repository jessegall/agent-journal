<?php

declare(strict_types=1);

namespace Tests\Support\Mocks;

use JsonSerializable;

/**
 * One line a mock expects to hear, by its method, and the parts of its answer in order.
 */
final readonly class MockStep implements JsonSerializable
{
    /**
     * @param  list<MockAction>  $actions
     */
    public function __construct(public string $method, private array $actions) {}

    /**
     * @return array{method: string, actions: list<MockAction>}
     */
    public function jsonSerialize(): array
    {
        return ['method' => $this->method, 'actions' => $this->actions];
    }
}
