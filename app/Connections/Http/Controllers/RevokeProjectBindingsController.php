<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Connections\Commands\RevokeProjectBinding;
use App\Contracts\CommandRefusal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Inertia\ResponseFactory;

/**
 * Revokes the bindings the owner chose in the Connect a project window, each in its own command, and shows the
 * window again with each binding's outcome: revoked, or the reason it was refused.
 */
final readonly class RevokeProjectBindingsController
{
    /**
     * The flash key the window reads each chosen binding's outcome from.
     */
    public const string OUTCOMES = 'revokedBindings';

    public function __invoke(
        Request $request,
        CommandBus $commands,
        ResponseFactory $inertia,
        Redirector $redirect,
    ): RedirectResponse {
        $request->validate(['bindings' => ['required', 'array', 'min:1', 'max:50'], 'bindings.*' => ['ulid']]);
        $outcomes = [];

        foreach ($request->array('bindings') as $binding) {
            $outcomes[(string) $binding] = $this->outcomeOf((string) $binding, $commands);
        }

        $inertia->flash(self::OUTCOMES, $outcomes);

        return $redirect->back(303);
    }

    /**
     * Revokes one binding and answers what came of it; one refusal does not stop the others, it is shown beside its
     * binding instead.
     */
    private function outcomeOf(string $binding, CommandBus $commands): string
    {
        try {
            $commands->run(new RevokeProjectBinding($binding));
        } catch (CommandRefusal $refusal) {
            return $refusal->getMessage();
        }

        return 'Revoked';
    }
}
