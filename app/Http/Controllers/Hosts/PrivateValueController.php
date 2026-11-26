<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hosts;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Commands\PullHostPrivateValue\PullHostPrivateValueCommand;
use App\Hosts\Values\HostContext;
use Illuminate\Http\JsonResponse;

/**
 * Hands a host the value of a private submission it was ordered to write, once.
 */
final readonly class PrivateValueController
{
    #[Dispatches(PullHostPrivateValueCommand::class)]
    public function __invoke(string $submission, HostContext $host, CommandBus $commands): JsonResponse
    {
        $value = $commands->run(new PullHostPrivateValueCommand($host->hostId, $submission));

        return new JsonResponse(['value' => $value]);
    }
}
