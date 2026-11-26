<?php

declare(strict_types=1);

namespace Tests\Fixtures\Architecture\Pipes;

use App\Bus\Contracts\Pipe;

/**
 * A pipe that only hands its work to a service, as the pipes architecture test refuses.
 */
final readonly class ForwardingPipe implements Pipe
{
    public function __construct(private ForwardedService $service) {}

    public function handle(object $value): object
    {
        $this->service->check($value);

        return $value;
    }
}
