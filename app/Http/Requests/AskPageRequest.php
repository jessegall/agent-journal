<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Values\AskReference;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The ask page's route: the ask it shows.
 */
final class AskPageRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function ask(): AskReference
    {
        return new AskReference(strtolower((string) $this->route('ask')));
    }
}
