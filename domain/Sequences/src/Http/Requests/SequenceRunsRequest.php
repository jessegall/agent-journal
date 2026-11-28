<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Requests;

use Domain\Sequences\Http\Requests\Concerns\ReadsRunsListAddress;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The runs list's address: the actor whose runs it shows, when one was chosen, and the page.
 */
final class SequenceRunsRequest extends FormRequest
{
    use ReadsRunsListAddress;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'actor' => [
                'nullable',
                'string',
            ],
            'page' => [
                'nullable',
                'integer',
                'min:1',
            ],
        ];
    }
}
