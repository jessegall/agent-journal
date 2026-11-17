<?php

declare(strict_types=1);

namespace App\Core\Web\Http\Controllers;

use App\Core\Web\Contracts\CurrentUserReader;
use App\Core\Web\Http\Requests\LayoutRequest;
use App\Core\Web\Models\Layout;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Saves, changes and deletes the signed-in user's layouts, then returns to the page that asked (303). Another user's
 * layout is out of the model's scope, so it answers 404.
 */
final readonly class LayoutsController
{
    public function __construct(
        private CurrentUserReader $users,
        private Redirector $redirect,
    ) {}

    public function store(LayoutRequest $request): RedirectResponse
    {
        Layout::query()->create([
            'user_id' => $this->users->currentUser()->get()->id,
            'name' => $request->layoutName(),
            'shape' => $request->shape(),
        ]);

        return $this->redirect->back(303);
    }

    public function update(LayoutRequest $request, Layout $layout): RedirectResponse
    {
        $layout->saveNameAndShape($request->layoutName(), $request->shape());

        return $this->redirect->back(303);
    }

    public function destroy(Layout $layout): RedirectResponse
    {
        $layout->delete();

        return $this->redirect->back(303);
    }
}
