<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests;

use Domain\Documents\Http\Requests\Concerns\ReadsLibraryFilters;
use Illuminate\Foundation\Http\FormRequest;

final class ListRecordsRequest extends FormRequest
{
    use ReadsLibraryFilters;

    /** @return array<string, list<mixed>> */
    public function rules(): array
    {
        return $this->libraryRules();
    }
}
