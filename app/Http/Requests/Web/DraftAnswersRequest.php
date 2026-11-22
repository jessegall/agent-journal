<?php

declare(strict_types=1);

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The noun a guided draft is for, from its address, and the answers given to its questions.
 */
final class DraftAnswersRequest extends FormRequest
{
    /**
     * The most answers a draft takes: the three questions of a guided entry.
     */
    private const int ANSWER_LIMIT = 3;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'answers' => ['required', 'array', 'size:'.self::ANSWER_LIMIT],
            'answers.*' => ['required', 'string', 'max:2000'],
        ];
    }

    public function noun(): string
    {
        return (string) $this->route('noun');
    }

    /**
     * @return list<string>
     */
    public function answers(): array
    {
        return array_values(array_map(strval(...), $this->array('answers')));
    }
}
