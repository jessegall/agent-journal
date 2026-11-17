<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Shelf;

use Illuminate\Foundation\Http\FormRequest;

final class ShelfRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['q' => ['nullable', 'string', 'max:20']];
    }
}
