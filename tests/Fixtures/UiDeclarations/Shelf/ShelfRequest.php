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

    /**
     * The words the shelf is searched for, empty when none were given.
     */
    public function queryWords(): string
    {
        return $this->string('q')->toString();
    }

    /**
     * The shelf the route names, empty when the route names none.
     */
    public function shelf(): string
    {
        return (string) $this->route('shelf');
    }
}
