<?php

declare(strict_types=1);

namespace App\Http\Requests\Web;

use App\Contracts\CurrentUserResolver;
use App\Models\Layout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

/**
 * A layout to save: a name of up to 80 characters the user has not used for another layout, and the shape the browser
 * sends, a pane tree under grid and a list of detached windows.
 */
final class LayoutRequest extends FormRequest
{
    /**
     * @return array<string, list<string|Unique>>
     */
    public function rules(CurrentUserResolver $users): array
    {
        $unique = Rule::unique('layouts', 'name')->where('user_id', $users->currentUser()->get()->id);
        $layout = $this->route('layout');

        if ($layout instanceof Layout) {
            $unique = $unique->ignore($layout->id);
        }

        return [
            'name' => ['required', 'string', 'max:80', 'regex:/\S/', $unique],
            'shape' => ['required', 'array'],
            'shape.grid' => ['required', 'array'],
            'shape.detached' => ['present', 'array'],
        ];
    }

    public function layoutName(): string
    {
        return trim($this->string('name')->toString());
    }

    /**
     * @return array<string, mixed>
     */
    public function shape(): array
    {
        return $this->array('shape');
    }
}
