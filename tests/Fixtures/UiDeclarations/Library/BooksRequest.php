<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Library;

use Illuminate\Foundation\Http\FormRequest;

final class BooksRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }
}
