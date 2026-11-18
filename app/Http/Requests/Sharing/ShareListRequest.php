<?php

declare(strict_types=1);

namespace App\Http\Requests\Sharing;

use App\Http\Data\Sharing\ShareFiltersData;
use App\Sharing\Enums\ShareState;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * The filters of the owner's list of shares, from the query string.
 */
final class ShareListRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'state' => ['nullable', Rule::enum(ShareState::class)],
            'rootType' => ['nullable', 'string', 'max:100'],
            'gateway' => ['nullable', 'string', 'ulid'],
            'expiresBefore' => ['nullable', 'date'],
            'after' => ['nullable', 'string', 'ulid'],
        ];
    }

    public function filters(): ShareFiltersData
    {
        return new ShareFiltersData(
            $this->enum('state', ShareState::class),
            $this->filled('rootType') ? $this->string('rootType')->toString() : null,
            $this->filled('gateway') ? $this->string('gateway')->toString() : null,
            $this->filled('expiresBefore') ? $this->string('expiresBefore')->toString() : null,
            $this->filled('after') ? $this->string('after')->toString() : null,
        );
    }
}
