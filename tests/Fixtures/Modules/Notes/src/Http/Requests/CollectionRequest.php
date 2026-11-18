<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Which collection a collection page shows, named by its route as a year and month; any other value is not found.
 */
final class CollectionRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function collection(): string
    {
        $value = (string) $this->route('collection');

        if (preg_match('/^[0-9]{4}-(0[1-9]|1[0-2])$/', $value) !== 1) {
            throw new NotFoundHttpException();
        }

        return $value;
    }
}
