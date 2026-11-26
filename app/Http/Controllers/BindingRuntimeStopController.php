<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Values\HostContext;
use App\Projects\Commands\RecordBindingRuntimeStop\RecordBindingRuntimeStopCommand;
use Illuminate\Http\Response;

/**
 * Takes a binding device's receipt that a runtime's session stopped, as its relay or journal claude sends it once the
 * session ended, also after the device was away.
 */
final readonly class BindingRuntimeStopController
{
    #[Dispatches(RecordBindingRuntimeStopCommand::class)]
    public function __invoke(string $binding, string $runtime, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new RecordBindingRuntimeStopCommand($host->hostId, $binding, $runtime));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
