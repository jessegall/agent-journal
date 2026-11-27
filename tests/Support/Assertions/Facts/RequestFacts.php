<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Facts;

use App\Models\Drivers\DriverRequest;
use Tests\Support\Assertions\Contracts\Facts;

/**
 * A request the journal made of a runtime's driver: how far it got, how it ended and what it was bound to.
 */
final readonly class RequestFacts implements Facts
{
    public function __construct(private DriverRequest $request) {}

    public function facts(): array
    {
        return [
            'progress' => $this->request->progress,
            'outcome' => $this->request->outcome,
            'binding' => $this->request->actual_binding,
        ];
    }
}
