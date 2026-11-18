<?php

declare(strict_types=1);

namespace App\Http\Requests\Sharing;

use App\Http\Requests\Sharing\Concerns\ReadsShareRoot;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner's selection for a share preview: the root from the route and the ids of the linked records selected.
 */
final class SaveSharePreviewRequest extends FormRequest
{
    use ReadsShareRoot;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'selected' => ['present', 'array', 'max:1000'],
            'selected.*' => ['string', 'ulid'],
        ];
    }

    /**
     * @return list<string>
     */
    public function selectedIds(): array
    {
        return array_values(array_map(strval(...), $this->array('selected')));
    }
}
