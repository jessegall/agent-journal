<?php

declare(strict_types=1);

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The noun whose draft questions are asked for, from the address.
 */
final class DraftQuestionsRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function noun(): string
    {
        return (string) $this->route('noun');
    }
}
