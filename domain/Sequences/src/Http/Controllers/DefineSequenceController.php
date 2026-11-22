<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Controllers;

use App\Contracts\CommandBus;
use Domain\Sequences\Commands\DefineSequence\DefineSequenceCommand;
use Domain\Sequences\Http\Requests\SaveSequenceRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class DefineSequenceController
{
    public function __invoke(SaveSequenceRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $id = $commands->run(new DefineSequenceCommand($request->name(), $request->steps()));

        return $redirect->to(route('sequences.sequence', ['sequence' => $id], false), 303);
    }
}
