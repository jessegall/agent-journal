<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Commands\ChangeLayout\ChangeLayoutCommand;
use App\Commands\DeleteLayout\DeleteLayoutCommand;
use App\Commands\SaveLayout\SaveLayoutCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Web\LayoutRequest;
use App\Models\Records\Layout;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Saves, changes and deletes the signed-in user's layouts through the bus, then returns to the page that asked (303).
 * Another user's layout is out of the model's scope, so it answers 404.
 */
final readonly class LayoutsController
{
    public function __construct(
        private CommandBus $commands,
        private Redirector $redirect,
    ) {}

    public function store(LayoutRequest $request): RedirectResponse
    {
        $this->commands->run(new SaveLayoutCommand($request->layoutName(), $request->shape()));

        return $this->redirect->back(303);
    }

    public function update(LayoutRequest $request, Layout $layout): RedirectResponse
    {
        $this->commands->run(new ChangeLayoutCommand($layout->id, $request->layoutName(), $request->shape()));

        return $this->redirect->back(303);
    }

    public function destroy(Layout $layout): RedirectResponse
    {
        $this->commands->run(new DeleteLayoutCommand($layout->id));

        return $this->redirect->back(303);
    }
}
