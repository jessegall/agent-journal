<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Controllers;

use App\Contracts\CommandBus;
use Domain\Sequences\Commands\ChangeSequence\ChangeSequenceCommand;
use Domain\Sequences\Http\Requests\SaveSequenceRequest;
use Domain\Sequences\Http\Requests\SequenceRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class ChangeSequenceController
{
    public function __invoke(
        SaveSequenceRequest $request,
        SequenceRequest $address,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $id = $address->sequenceId();
        $commands->run(new ChangeSequenceCommand($id, $request->openedVersion(), $request->name(), $request->steps()));

        return $redirect->to(route('sequences.sequence', ['sequence' => $id], false), 303);
    }
}
