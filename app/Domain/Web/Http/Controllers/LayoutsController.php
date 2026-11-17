<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Controllers;

use App\Domain\Access\Contracts\ViewerReader;
use App\Domain\Web\Http\Requests\LayoutRequest;
use App\Domain\Web\Models\Layout;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Saves, changes and deletes the signed-in user's layouts, then returns to the page that asked (303). Another user's
 * layout is out of the model's scope, so it answers 404.
 */
final readonly class LayoutsController
{
    public function __construct(
        private ViewerReader $viewers,
        private Redirector $redirect,
    ) {}

    public function store(LayoutRequest $request): RedirectResponse
    {
        Layout::query()->create([
            'user_id' => $this->viewers->viewer()?->id,
            'name' => $request->layoutName(),
            'shape' => $request->shape(),
        ]);

        return $this->redirect->back(303);
    }

    public function update(LayoutRequest $request, Layout $layout): RedirectResponse
    {
        $layout->update(['name' => $request->layoutName(), 'shape' => $request->shape()]);

        return $this->redirect->back(303);
    }

    public function destroy(Layout $layout): RedirectResponse
    {
        $layout->delete();

        return $this->redirect->back(303);
    }
}
