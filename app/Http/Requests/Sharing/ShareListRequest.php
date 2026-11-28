<?php

declare(strict_types=1);

namespace App\Http\Requests\Sharing;

use App\Sharing\Data\ShareFiltersData;
use App\Sharing\Enums\ShareStatus;
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
            'state' => [
                'nullable',
                Rule::enum(ShareStatus::class),
            ],
            'rootType' => [
                'nullable',
                'string',
                'max:100',
            ],
            'gateway' => [
                'nullable',
                'string',
                'ulid',
            ],
            'expiresBefore' => [
                'nullable',
                'date',
            ],
            'after' => [
                'nullable',
                'string',
                'ulid',
            ],
        ];
    }

    public function filters(): ShareFiltersData
    {
        $filters = [
            'rootType' => $this->filled('rootType') ? $this->string('rootType')->toString() : null,
            'gateway' => $this->filled('gateway') ? $this->string('gateway')->toString() : null,
            'expiresBefore' => $this->filled('expiresBefore') ? $this->string('expiresBefore')->toString() : null,
            'after' => $this->filled('after') ? $this->string('after')->toString() : null,
        ];

        $state = $this->enum('state', ShareStatus::class);

        return ShareFiltersData::from($state === null ? $filters : [
            ...$filters,
            'state' => $state,
        ]);
    }
}
