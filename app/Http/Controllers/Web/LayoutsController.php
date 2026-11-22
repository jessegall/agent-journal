<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Contracts\CurrentUserResolver;
use App\Http\Requests\Web\LayoutRequest;
use App\Models\Layout;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Saves, changes and deletes the signed-in user's layouts, then returns to the page that asked (303). Another user's
 * layout is out of the model's scope, so it answers 404.
 */
final readonly class LayoutsController
{
    public function __construct(
        private CurrentUserResolver $users,
        private Redirector $redirect,
    ) {}

    public function store(LayoutRequest $request): RedirectResponse
    {
        Layout::create($this->users->currentUser()->get()->id, $request->layoutName(), $request->shape());

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
